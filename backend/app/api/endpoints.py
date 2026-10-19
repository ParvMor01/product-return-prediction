"""
FastAPI Router for Product Return Prediction Analytics.
"""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any

from backend.app.schemas.predict_schema import OrderPredictionRequest, PredictionResponse
from backend.app.services.analytics_service import analytics_service
from backend.ml.predict import get_predictor

router = APIRouter(prefix="/api", tags=["Product Return Prediction"])

@router.get("/health")
def health_check() -> Dict[str, Any]:
    try:
        predictor = get_predictor()
        model_ready = predictor is not None
    except Exception:
        model_ready = False

    return {
        "status": "healthy",
        "service": "Product Return Prediction API",
        "model_loaded": model_ready,
        "algorithm": "Logistic Regression with Scikit-learn Pipeline"
    }

@router.get("/summary")
def get_summary() -> Dict[str, Any]:
    try:
        return analytics_service.get_summary()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate dashboard summary: {str(e)}"
        )

@router.get("/dataset")
def get_dataset() -> Dict[str, Any]:
    try:
        return analytics_service.get_dataset_overview()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve dataset overview: {str(e)}"
        )

@router.get("/eda")
def get_eda_data() -> Dict[str, Any]:
    try:
        return analytics_service.get_eda()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compute exploratory data analysis: {str(e)}"
        )

@router.get("/model/metrics")
def get_model_metrics() -> Dict[str, Any]:
    try:
        return analytics_service.get_model_metrics()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load model metrics: {str(e)}"
        )

@router.get("/model/features")
def get_model_features() -> Dict[str, Any]:
    try:
        meta = analytics_service.get_model_metrics()
        return {
            "top_features": meta.get("top_features", []),
            "all_features": meta.get("all_features", []),
            "intercept": meta.get("intercept", 0.0)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load feature importance: {str(e)}"
        )

@router.post("/predict", response_model=PredictionResponse)
def predict_return(order: OrderPredictionRequest) -> PredictionResponse:
    try:
        predictor = get_predictor()
        input_dict = order.model_dump()
        result = predictor.predict_single(input_dict)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prediction failed: {str(e)}"
        )
