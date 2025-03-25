from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn
from uuid import uuid4

# Load environment variables
load_dotenv(dotenv_path="./.env")

# Define allowed origins for CORS
origins = [
    "http://localhost:5173"
]

# Create FastAPI app
app = FastAPI(title="Simple Item API with SSO")

# Add middleware
app.add_middleware(SessionMiddleware, secret_key="supersecret")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize and configure OAuth
oauth = OAuth()
oauth.register(
    name='oidc',
    client_id=os.getenv("OIDC_CLIENT_ID"),
    client_secret=os.getenv("OIDC_CLIENT_SECRET"),
    server_metadata_url=f"{os.getenv('OIDC_ISSUER')}/.well-known/openid-configuration",
    client_kwargs={'scope': 'openid email profile'},
)

# In-memory storage (replace with a database in production)
backups = {"backups": []}
restores = {"restores": []}
schedule_backups = {"schedule_backups": []}
namespaces = {"namespaces": [{"name": "aloni"}, {"name": "omeriko"}, {"name": "kaki"}]}

# SSO Routes (from sso.py)
@app.get("/")
def public():
    return {"message": "Hello World"}

@app.get("/login")
async def login(request: Request):
    request.session.clear()  # Clear session to avoid stale data
    state = str(uuid4())  # Generate unique state
    request.session['state'] = state
    redirect_uri = os.getenv("REDIRECT_URI")
    return await oauth.oidc.authorize_redirect(request, redirect_uri, state=state)

@app.get("/auth/callback")
async def auth_callback(request: Request):
    state = request.query_params.get("state")
    stored_state = request.session.get("state")
    if state != stored_state:
        raise HTTPException(status_code=400, detail="CSRF attack detected: state mismatch.")
    
    token = await oauth.oidc.authorize_access_token(request)
    user_info = await oauth.oidc.userinfo(token=token)
    request.session['user'] = dict(user_info)
    request.session['token'] = dict(token)
    return RedirectResponse(url="http://localhost:5173/dashboard")

@app.get("/me")
def protected_user(request: Request):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="http://localhost:5173/login")
    print(f"user: {user}")
    return JSONResponse(content={"user": user})

# API Routes (original endpoints)
@app.get("/get-user-namespaces", response_model=dict)
async def get_user_namespaces(request: Request):
    """Get namespaces"""
    token = request.session.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token is missing in the session.")
    user_info = await oauth.oidc.userinfo(token=token)
    return namespaces

@app.get("/get-backups", response_model=dict)
async def get_backups(namespace: str = Query(None)):
    """Get backups, optionally filtered by namespace"""
    if namespace:
        filtered = [b for b in backups["backups"] if b.get("namespace") == namespace]
        return {"backups": filtered}
    return backups

@app.get("/get-restores", response_model=dict)
async def get_restores(namespace: str = Query(None)):
    """Get restores, optionally filtered by namespace"""
    if namespace:
        filtered = [r for r in restores["restores"] if r.get("namespace") == namespace]
        return {"restores": filtered}
    return restores

@app.get("/get-scheduled-backups", response_model=dict)
async def get_schedule_backups():
    """Fetch all scheduled backups"""
    return schedule_backups

@app.post("/create-backup", response_model=dict)
async def create_backup(request: Request):
    params = await request.json()
    backup = {
        "namespace": params["namespaces"],
        "backup_name": f"{params['namespaces']}-backup",
        "Time Created": "2025-03-13T",
        "Status": "Completed"
    }
    backups["backups"].append(backup)
    return {"message": "Created backup successfully"}

@app.post("/create-restore", response_model=dict)
async def create_restore(request: Request):
    params = await request.json()
    restore = {
        "name": f"{params['namespaces']}-restore",
        "Time Created": "2025-03-13T",
        "status": "Completed",
        "namespace": params["namespaces"],
        "backup_name": f"{params['namespaces']}-restore",
        "included_resources": params["included_resources"],
        "match_lables": params["match_lables"],
    }
    restores["restores"].append(restore)
    return {"message": "Created restore successfully"}

@app.post("/create-schedule-backup", response_model=dict)
async def create_schedule_backup(request: Request):
    params = await request.json()
    schedule_backup = {
        "name": f"{params['namespaces']}-schedule",
        "namespace": params["namespaces"],
        "frequency": params["schedule"],
        "amount": f"{params['amount']}",
        "Time Created": "2025-03-13T",
        "Status": "Scheduled"
    }
    schedule_backups["schedule_backups"].append(schedule_backup)
    return {"message": "Created scheduled backup successfully"}

@app.delete("/delete-backup", response_model=dict)
async def delete_backup(request: Request):
    params = await request.json()
    if "backup_name" not in params:
        raise HTTPException(status_code=400, detail="Missing backup_name in request")
    backups["backups"] = [b for b in backups["backups"] if b.get("backup_name") != params["backup_name"]]
    return {"message": f"Backup {params['backup_name']} deleted successfully"}

@app.delete("/delete-schedule-backup", response_model=dict)
async def delete_schedule_backup(request: Request):
    params = await request.json()
    schedule_name = params.get("schedule_name")
    if not any(s["name"] == schedule_name for s in schedule_backups["schedule_backups"]):
        raise HTTPException(status_code=404, detail="Scheduled backup not found")
    schedule_backups["schedule_backups"] = [
        s for s in schedule_backups["schedule_backups"] if s["name"] != schedule_name
    ]
    return {"message": f"Scheduled backup '{schedule_name}' deleted successfully"}

# Run the app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)