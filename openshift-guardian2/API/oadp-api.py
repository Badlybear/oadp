from fastapi import FastAPI, HTTPException, Request, Query, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn
from uuid import uuid4
from typing import Optional, Dict, Any
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(dotenv_path="./.env")

# Define allowed origins for CORS
origins = ["http://localhost:5173"]

# Create FastAPI app
app = FastAPI(title="Simple Item API with SSO")

# Add middleware
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET", "supersecret"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OAuth
oauth = OAuth()
oauth.register(
    name="oidc",
    client_id=os.getenv("OIDC_CLIENT_ID"),
    client_secret=os.getenv("OIDC_CLIENT_SECRET"),
    server_metadata_url=f"{os.getenv('OIDC_ISSUER')}/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# In-memory storage (replace with a database in production)
backups: Dict[str, list] = {"backups": []}
restores: Dict[str, list] = {"restores": []}
schedule_backups: Dict[str, list] = {"schedule_backups": []}
namespaces: Dict[str, list] = {"namespaces": [{"name": "aloni"}, {"name": "omeriko"}, {"name": "kaki"}]}

# Pydantic models for request validation
class BackupRequest(BaseModel):
    namespaces: str
    included_resources: Optional[list] = None
    match_labels: Optional[dict] = None

class RestoreRequest(BaseModel):
    namespaces: str
    included_resources: list
    match_labels: dict

class ScheduleBackupRequest(BaseModel):
    namespaces: str
    schedule: str
    amount: int

class DeleteBackupRequest(BaseModel):
    backup_name: str

class DeleteScheduleBackupRequest(BaseModel):
    schedule_name: str

# Dependency for authentication
async def get_current_user(request: Request) -> dict:
    """Check authentication and return user info, caching it in the session."""
    token = request.session.get("token")
    user_info = request.session.get("user_info")

    if not token or (not user_info or request.session.get("token_hash") != hash(str(token))):
        try:
            if token:  # If token exists but is invalid, try to fetch user info
                user_info = await oauth.oidc.userinfo(token=token)
                request.session["user_info"] = dict(user_info)
                request.session["token_hash"] = hash(str(token))
                logger.info("User info fetched and cached.")
            else:
                logger.info("No token found, redirecting to login.")
                return RedirectResponse(url="/login")
        except OAuthError as e:
            logger.warning(f"Invalid or expired token: {str(e)}")
            return RedirectResponse(url="/login")
        except Exception as e:
            logger.error(f"Unexpected error fetching user info: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    return user_info

# SSO Routes
@app.get("/")
def public():
    return {"message": "Hello World"}

@app.get("/login")
async def login(request: Request):
    request.session.clear()
    state = str(uuid4())
    request.session["state"] = state
    redirect_uri = os.getenv("REDIRECT_URI")  # Should be http://localhost:8000/auth/callback
    return await oauth.oidc.authorize_redirect(request, redirect_uri, state=state)

@app.get("/auth/callback")
async def auth_callback(request: Request):
    state = request.query_params.get("state")
    stored_state = request.session.get("state")
    if state != stored_state:
        raise HTTPException(status_code=400, detail="CSRF attack detected: state mismatch")

    try:
        token = await oauth.oidc.authorize_access_token(request)
        user_info = await oauth.oidc.userinfo(token=token)
        request.session["user"] = dict(user_info)
        request.session["token"] = dict(token)
        request.session["user_info"] = dict(user_info)
        request.session["token_hash"] = hash(str(token))
        logger.info("User authenticated successfully")
        return RedirectResponse(url="http://localhost:5173/dashboard")
    except OAuthError as e:
        logger.error(f"Authentication failed: {str(e)}")
        return RedirectResponse(url="/login")

@app.get("/me")
async def protected_user(user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    return {"user": user}

# API Endpoints
@app.get("/get-user-namespaces", response_model=dict)
async def get_user_namespaces(user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    return namespaces

@app.get("/get-backups", response_model=dict)
async def get_backups(namespace: Optional[str] = Query(None), user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    if namespace:
        filtered = [b for b in backups["backups"] if b.get("namespace") == namespace]
        return {"backups": filtered}
    return backups

@app.get("/get-restores", response_model=dict)
async def get_restores(namespace: Optional[str] = Query(None), user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    if namespace:
        filtered = [r for r in restores["restores"] if r.get("namespace") == namespace]
        return {"restores": filtered}
    return restores

@app.get("/get-scheduled-backups", response_model=dict)
async def get_schedule_backups(user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    return schedule_backups

@app.post("/create-backup", response_model=dict)
async def create_backup(params: BackupRequest, user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    backup = {
        "namespace": params.namespaces,
        "backup_name": f"{params.namespaces}-backup",
        "Time Created": "2025-03-13T",
        "Status": "Completed",
    }
    backups["backups"].append(backup)
    return {"message": "Created backup successfully"}

@app.post("/create-restore", response_model=dict)
async def create_restore(params: RestoreRequest, user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    restore = {
        "name": f"{params.namespaces}-restore",
        "Time Created": "2025-03-13T",
        "status": "Completed",
        "namespace": params.namespaces,
        "backup_name": f"{params.namespaces}-restore",
        "included_resources": params.included_resources,
        "match_labels": params.match_labels,
    }
    restores["restores"].append(restore)
    return {"message": "Created restore successfully"}

@app.post("/create-schedule-backup", response_model=dict)
async def create_schedule_backup(params: ScheduleBackupRequest, user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    schedule_backup = {
        "name": f"{params.namespaces}-schedule",
        "namespace": params.namespaces,
        "frequency": params.schedule,
        "amount": str(params.amount),
        "Time Created": "2025-03-13T",
        "Status": "Scheduled",
    }
    schedule_backups["schedule_backups"].append(schedule_backup)
    return {"message": "Created scheduled backup successfully"}

@app.delete("/delete-backup", response_model=dict)
async def delete_backup(params: DeleteBackupRequest, user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    backups["backups"] = [b for b in backups["backups"] if b.get("backup_name") != params.backup_name]
    return {"message": f"Backup '{params.backup_name}' deleted successfully"}

@app.delete("/delete-schedule-backup", response_model=dict)
async def delete_schedule_backup(params: DeleteScheduleBackupRequest, user: dict = Depends(get_current_user)):
    if isinstance(user, RedirectResponse):
        return user
    if not any(s["name"] == params.schedule_name for s in schedule_backups["schedule_backups"]):
        raise HTTPException(status_code=404, detail="Scheduled backup not found")
    schedule_backups["schedule_backups"] = [
        s for s in schedule_backups["schedule_backups"] if s["name"] != params.schedule_name
    ]
    return {"message": f"Scheduled backup '{params.schedule_name}' deleted successfully"}

# Run the app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)