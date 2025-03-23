from fastapi import FastAPI, HTTPException, Request, Query
from pydantic import BaseModel
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Simple Item API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 👈 Allow only React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration (in real apps, use a database)
backups = {"backups": []}
restores = {"restores": []}
schedule_backups = {"schedule_backups": []}
namespaces = {"namespaces": [{"name": "aloni"}, {"name": "omeriko"}, {"name": "kaki"}]}


@app.get("/get-user-namespaces", response_model=dict)
async def get_user_namespaces():
    """Get namespaces"""
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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
