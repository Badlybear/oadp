from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os, uvicorn
from uuid import uuid4  # For generating unique state

env_path = './.env'
load_dotenv(dotenv_path="./.env")

origins = [
    "http://localhost:5173",
    "http://localhost:8000"
]

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="supersecret")  
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # 👈 important for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth = OAuth()

oauth.register(
    name='oidc',
    client_id=os.getenv("OIDC_CLIENT_ID"),
    client_secret=os.getenv("OIDC_CLIENT_SECRET"),
    server_metadata_url=f"{os.getenv('OIDC_ISSUER')}/.well-known/openid-configuration",
    client_kwargs={
        'scope': 'openid email profile',
    }
)

print(f"{os.getenv('OIDC_ISSUER')}/.well-known/openid-configuration")
print(os.getenv("OIDC_CLIENT_ID"))
print(os.getenv("OIDC_CLIENT_SECRET"))

@app.get("/")
def public():
    return {"message": "Hello World"}

@app.get("/login")
async def login(request: Request):
    # Clear the existing session to avoid stale data
    request.session.clear()  # Clears the session

    state = str(uuid4())  # Generate a unique state
    request.session['state'] = state  # Store it in the session
    redirect_uri = os.getenv("REDIRECT_URI")
    return await oauth.oidc.authorize_redirect(request, redirect_uri, state=state)


@app.get("/auth/callback")
async def auth_callback(request: Request):
    # Get the state from the request
    state = request.query_params.get("state")
    # Get the state stored in the session
    stored_state = request.session.get("state")

    # Compare the states
    if state != stored_state:
        raise HTTPException(status_code=400, detail="CSRF attack detected: state mismatch.")
    
    # Proceed with the token authorization if states match
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
