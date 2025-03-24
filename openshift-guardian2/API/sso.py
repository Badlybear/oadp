from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import os, uvicorn

env_path ='./.env'
load_dotenv(dotenv_path="./.env")

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="supersecret")  # Change this in prod!

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
    redirect_uri = os.getenv("REDIRECT_URI")
    return await oauth.oidc.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback")
async def auth_callback(request: Request):
    token = await oauth.oidc.authorize_access_token(request)
    user_info = await oauth.oidc.userinfo(token=token)
    request.session['user'] = dict(user_info)
    return RedirectResponse(url="http://localhost:3000/dashboard") 


@app.get("/me")
def protected_user(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return JSONResponse(content={"user": user})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)