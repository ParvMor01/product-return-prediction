"""
API and Model Unit Tests.
Verifies all endpoints and ML predictions conform to specifications.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True

def test_summary_endpoint():
    response = client.get("/api/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_orders" in data
    assert "return_rate" in data
    assert "test_accuracy" in data
    assert "test_f1" in data
    assert "test_roc_auc" in data

def test_dataset_endpoint():
    response = client.get("/api/dataset")
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] >= 3000
    assert "numerical_features" in data
    assert "categorical_features" in data
    assert len(data["preview_records"]) > 0

def test_eda_endpoint():
    response = client.get("/api/eda")
    assert response.status_code == 200
    data = response.json()
    assert "return_distribution" in data
    assert "category_returns" in data
    assert "delivery_delay" in data
    assert "correlations" in data

def test_model_metrics_endpoint():
    response = client.get("/api/model/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "test_metrics" in data
    assert "confusion_matrix" in data
    assert "cross_validation" in data
    assert "hyperparameter_tuning" in data
    assert data["test_metrics"]["accuracy"] > 0.60

def test_predict_endpoint_high_risk():
    payload = {
        "Customer_Age": 24,
        "Customer_Gender": "Female",
        "Product_Category": "Apparel",
        "Product_Price": 140.0,
        "Discount_Percentage": 35.0,
        "Quantity": 2,
        "Previous_Orders": 6,
        "Previous_Returns": 5,
        "Customer_Rating": 2.5,
        "Delivery_Time": 9,
        "Expected_Delivery_Time": 3,
        "Payment_Method": "Cash on Delivery",
        "Shipping_Method": "Standard",
        "Customer_Location": "North",
        "Product_Rating": 2.2,
        "Is_First_Order": "No"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] in [0, 1]
    assert 0.0 <= data["return_probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Medium", "High"]
    assert len(data["top_factors"]) > 0
    assert len(data["explanation_summary"]) > 0

def test_predict_endpoint_low_risk():
    payload = {
        "Customer_Age": 45,
        "Customer_Gender": "Male",
        "Product_Category": "Books",
        "Product_Price": 30.0,
        "Discount_Percentage": 5.0,
        "Quantity": 1,
        "Previous_Orders": 12,
        "Previous_Returns": 0,
        "Customer_Rating": 4.9,
        "Delivery_Time": 2,
        "Expected_Delivery_Time": 3,
        "Payment_Method": "UPI",
        "Shipping_Method": "Express",
        "Customer_Location": "South",
        "Product_Rating": 4.8,
        "Is_First_Order": "No"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == 0
    assert data["risk_level"] == "Low"
    assert data["return_probability"] < 0.35
