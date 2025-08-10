# auth.py

from fastapi import Depends, HTTPException, Header
from jose import jwt
import requests
import os
from dotenv import load_dotenv

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_IDENTIFIER = os.getenv("API_IDENTIFIER")
ALGORITHMS = [os.getenv("ALGORITHMS")]

def get_token_auth_header(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header.")
    return authorization.split(" ")[1]

def verify_jwt(token: str = Depends(get_token_auth_header)):
    try:
        # Get the public keys from Auth0
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()

        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }

        if not rsa_key:
            raise HTTPException(status_code=401, detail="Invalid header: Key not found.")

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_IDENTIFIER,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired.")
    except jwt.JWTClaimsError:
        raise HTTPException(status_code=401, detail="Incorrect claims. Please check the audience and issuer.")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Unable to parse token: {e}")
