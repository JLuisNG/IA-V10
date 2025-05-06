from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
from sqlalchemy import inspect, text

sys.path.append("/app")

from database.connection import engine, Base
from database.models import Staff, Pacientes, CertificationPeriod, Documentos
from routes import create_router, search_router, update_router, delete_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.1.33:3000", "http://localhost:3000", "http://192.168.1.32:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.on_event("startup")
async def startup():
    try:
        with engine.connect() as conn:
            conn.execute(text("SET search_path TO public;"))
        
        Base.metadata.create_all(bind=engine)  # SOLO CREA LOS MODELOS DEFINIDOS

    except Exception as e:
        print(f"Error during startup: {e}")

app.include_router(create_router, prefix="/api")
app.include_router(search_router, prefix="/api")
app.include_router(update_router, prefix="/api")
app.include_router(delete_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)