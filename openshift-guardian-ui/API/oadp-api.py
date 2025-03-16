from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="Simple Item API")

# In-memory storage for demonstration (in real apps, use a database)
items = {}
backups = [{"name": "backup1", "Time Created": "2025-03-13T", "Status": "Completed"}, {"name": "backup2", "Time Created": "2025-03-13T", "Status": "Completed"}]
restores = [{"name": "restore1", "Restore Time": "2025-03-13T", "Status": "Completed"}, {"name": "restore2", "Restore Time": "2025-03-13T", "Status": "Completed"}]

# Pydantic model for item data validation
class Item(BaseModel):
    name: str
    description: str = None
    price: float

# GET Requests
@app.get("/get-backups/", response_model=dict)
async def get_backups():
    """Get backups"""
    return backups

@app.get("/get-restores/", response_model=dict)
async def get_restores():
    """Get restores"""
    return restores

@app.post("/create-backup/", response_model=dict)
async def create_backup(request: Request):
    params = await request.json()
    backup = {"namespace": params["namespace"], "backup_name": f"{params["namespace"]}-backup", "Time Created": "2025-03-13T", "Status": "Completed"}
    backups.append(backup)
    """Create backup"""
    return f"Created backup"

# POST Requests
@app.post("/create-restore/", response_model=dict)
async def create_restore(request: Request):
    params = await request.json()
    restore = {"namespace": params["namespace"], "backup_name": params["backup_name"], "backup_name": f"{params["namespace"]}-backup", "Time Created": "2025-03-13T", "Status": "Completed"}
    backups.append(backup)
    """Create backup"""
    return f"Created backup"


@app.post("/items/{item_id}/duplicate", response_model=Item)
async def duplicate_item(item_id: int):
    """Duplicate an existing item"""
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    new_item = items[item_id].copy()
    new_id = len(items) + 1
    items[new_id] = new_item
    return new_item
    
# DELETE Requests
@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    """Delete a specific item by ID"""
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    del items[item_id]
    return {"message": f"Item {item_id} deleted successfully"}

@app.delete("/items/")
async def delete_all_items():
    """Delete all items"""
    items.clear()
    return {"message": "All items deleted successfully"}

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)