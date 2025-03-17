from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Simple Item API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 👈 Allow only React app
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # ✅ Allow all headers
)

# In-memory storage for demonstration (in real apps, use a database)
items = {}
backups = {"backups":[]}
restores = {"restores":[]}
schedule_backups = {"schedule_backups": []}
namespaces = {"namespaces": [{"name": "aloni"}, {"name": "omeriko"}, {"name": "kaki"}]}

@app.get("/get-user-namespaces", response_model=dict)
async def get_user_namespaces():
    """Get namespaces"""
    return namespaces

@app.get("/get-backups", response_model=dict)
async def get_backups():
    """Get backups"""
    return backups

@app.get("/get-restores", response_model=dict)
async def get_restores():
    """Get restores"""
    return restores

@app.post("/create-backup", response_model=dict)
async def create_backup(request: Request):
    params = await request.json()
    backup = {
        "namespace": params["namespaces"],  # ✅ Fix key
        "backup_name": f"{params['namespaces']}-backup",  # ✅ Generates backup name correctly
        "Time Created": "2025-03-13T",
        "Status": "Completed"
    }
    backups["backups"].append(backup)  # ✅ Corrected append
    return {"message": "Created backup successfully"}  # ✅ Return a dictionary

@app.post("/create-restore", response_model=dict)
async def create_restore(request: Request):
    params = await request.json()
    restore = {
        "namespace": params["namespaces"],
        "backup_name": f"{params['namespaces']}-restore",
        "Time Created": "2025-03-13T",
        "Status": "Completed"
    }
    restores["restores"].append(restore)
    return {"message": "Created restore successfully"}

@app.post("/create-schedule-backup", response_model=dict)
async def create_schedule_backup(request: Request):
    params = await request.json()
    schedule_backup = {
        "namespace": params["namespaces"],
        "frequency": params["schedule"],
        "amount": f"{params['amount']}",
        "Time Created": "2025-03-13T",
        "Status": "Completed"
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
    schedule_backups["schedule_backups"] = [s for s in schedule_backups["schedule_backups"] if s["name"] != params["schedule_name"]]
    return {"message": f"Scheduled backup {params['schedule_name']} deleted successfully"}

@app.get("/get-scheduled-backups", response_model=dict)
async def get_scheduled_backups():
    """Fetch all scheduled backups"""
    return {"scheduled_backups": schedule_backups}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)