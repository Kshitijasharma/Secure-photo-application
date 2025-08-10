
# from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import OAuth2PasswordBearer
# from jose import jwt
# import shutil
# import os
# import requests
# from datetime import datetime

# from db import add_user, get_user_by_email, add_upload, init_db
# from models import Base
# from azure_blob import upload_to_blob  # Azure blob integration

# app = FastAPI()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# # Allow React frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# AUTH0_DOMAIN = "dev-v6gkgrfuvuz8gvgd.us.auth0.com"
# API_AUDIENCE = "https://myapi.example.com"
# ALGORITHMS = ["RS256"]

# def get_jwk():
#     jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
#     return requests.get(jwks_url).json()

# def verify_jwt(token: str = Depends(oauth2_scheme)):
#     jwks = get_jwk()["keys"]
#     unverified_header = jwt.get_unverified_header(token)
#     rsa_key = {}

#     for key in jwks:
#         if key["kid"] == unverified_header["kid"]:
#             rsa_key = {
#                 "kty": key["kty"],
#                 "kid": key["kid"],
#                 "use": key["use"],
#                 "n": key["n"],
#                 "e": key["e"]
#             }
#             break

#     if rsa_key:
#         try:
#             payload = jwt.decode(
#                 token,
#                 rsa_key,
#                 algorithms=ALGORITHMS,
#                 audience=API_AUDIENCE,
#                 issuer=f"https://{AUTH0_DOMAIN}/"
#             )
#             return payload
#         except Exception:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

#     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# @app.post("/upload")
# async def upload_image(file: UploadFile = File(...), payload: dict = Depends(verify_jwt)):
#     if not file.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="Only image files are allowed.")

#     user_email = payload.get("email") or payload.get("sub")
#     user_id = payload.get("sub")

#     if not user_id:
#         raise HTTPException(status_code=400, detail="User info not found in token")

#     user = get_user_by_email(user_email)
#     if not user:
#         user = add_user(user_email, payload.get("name", ""))

#     # Save locally
#     file_location = os.path.join(UPLOAD_DIR, file.filename)
#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     # Upload to Azure
#     blob_url = upload_to_blob(file_location, file.filename)

#     # Save record in DB
#     upload_time = datetime.utcnow()
#     upload_record = add_upload(user.id, file.filename, blob_url)

#     return {
#         "message": "Image uploaded successfully",
#         "filename": file.filename,
#         "file_url": blob_url,
#         "upload_time": upload_time.isoformat(),
#         "upload_id": upload_record.id
#     }

# @app.get("/protected")
# def protected_route(payload: dict = Depends(verify_jwt)):
#     return {"message": "You are authenticated", "user": payload}

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     await websocket.send_text("WebSocket connection established.")
#     try:
#         while True:
#             data = await websocket.receive_text()
#             await websocket.send_text(f"Message received: {data}")
#     except WebSocketDisconnect:
#         print("Client disconnected")

# # Run DB setup
# @app.on_event("startup")
# def on_startup():
#     init_db()

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
import shutil
import os
import requests
from datetime import datetime

from db import add_user, get_user_by_email, add_upload, get_uploads_by_user, init_db
from models import Base
from azure_blob import upload_to_blob  # Azure blob integration

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Auth0 Config
AUTH0_DOMAIN = "dev-v6gkgrfuvuz8gvgd.us.auth0.com"
API_AUDIENCE = "https://myapi.example.com"
ALGORITHMS = ["RS256"]


# --- Auth Helpers ---
def get_jwk():
    jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    return requests.get(jwks_url).json()


def verify_jwt(token: str = Depends(oauth2_scheme)):
    jwks = get_jwk()["keys"]
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}

    for key in jwks:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
            break

    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer=f"https://{AUTH0_DOMAIN}/"
            )
            return payload
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


# --- Upload Route ---
@app.post("/upload")
async def upload_image(file: UploadFile = File(...), payload: dict = Depends(verify_jwt)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")

    user_email = payload.get("email") or payload.get("sub")
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=400, detail="User info not found in token")

    user = get_user_by_email(user_email)
    if not user:
        user = add_user(user_email, payload.get("name", ""))

    # Save locally
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Upload to Azure
    blob_url = upload_to_blob(file_location, file.filename)

    # Save record in DB
    upload_time = datetime.utcnow()
    upload_record = add_upload(user.id, file.filename, blob_url)

    return {
        "message": "Image uploaded successfully",
        "filename": file.filename,
        "file_url": blob_url,
        "upload_time": upload_time.isoformat(),
        "upload_id": upload_record.id
    }


# --- New Route: List user's uploads ---
@app.get("/my-uploads")
def list_user_uploads(payload: dict = Depends(verify_jwt)):
    user_email = payload.get("email") or payload.get("sub")
    user = get_user_by_email(user_email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    uploads = get_uploads_by_user(user.id)

    return [
        {
            "filename": u.filename,
            "url": u.file_url,
            "uploaded_at": u.uploaded_at.isoformat()
        }
        for u in uploads
    ]


# --- Protected route example ---
@app.get("/protected")
def protected_route(payload: dict = Depends(verify_jwt)):
    return {"message": "You are authenticated", "user": payload}


# --- WebSocket example ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("WebSocket connection established.")
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")


# --- Startup event: initialize DB ---
@app.on_event("startup")
def on_startup():
    init_db()
