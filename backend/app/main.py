"""
FastAPI Application Entry Point for Product Return Prediction.
Serves both REST analytics API endpoints and compiled frontend static assets.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app.api.endpoints import router

app = FastAPI(
    title="Product Return Prediction API",
    description="Predictive Analytics Web Application using Logistic Regression",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main analytics & prediction API routes
app.include_router(router)

# Serve compiled React frontend if present
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_react_app(full_path: str):
        # Do not catch API routes
        if full_path.startswith("api"):
            return None
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend distribution index not found."}
else:
    @app.get("/")
    def root():
        return {
            "message": "Product Return Prediction API is operational",
            "docs_url": "/docs",
            "health_url": "/api/health"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
