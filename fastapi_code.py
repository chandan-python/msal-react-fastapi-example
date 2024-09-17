from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from authlib.integrations.starlette_client import OAuth
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Replace these with your actual values
CLIENT_ID = 'YOUR_CLIENT_ID'
CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
AUTHORITY = 'https://login.microsoftonline.com/YOUR_TENANT_ID'
API_SCOPE = 'https://graph.microsoft.com/.default'

# Initialize OAuth
oauth = OAuth()
oauth.register(
    name='microsoft',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    authorize_url=f'{AUTHORITY}/oauth2/v2.0/authorize',
    authorize_params=None,
    access_token_url=f'{AUTHORITY}/oauth2/v2.0/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri=None,
    client_kwargs={'scope': API_SCOPE},
)

# OAuth2 bearer token
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f'{AUTHORITY}/oauth2/v2.0/authorize',
    tokenUrl=f'{AUTHORITY}/oauth2/v2.0/token'
)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # Verify token with Microsoft
        user_info = oauth.microsoft.parse_id_token(token)
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_info
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.get("/protected-endpoint")
async def protected_endpoint(user: dict = Depends(get_current_user)):
    return {"message": "This is a protected endpoint", "user": user}
