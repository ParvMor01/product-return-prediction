"""
Pydantic Schemas for API Requests and Responses.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class OrderPredictionRequest(BaseModel):
    Customer_Age: int = Field(..., ge=18, le=100, description="Customer age between 18 and 100")
    Customer_Gender: str = Field(..., description="Female, Male, or Other")
    Product_Category: str = Field(..., description="Product Category name")
    Product_Price: float = Field(..., ge=0.0, description="Product price in currency units")
    Discount_Percentage: float = Field(..., ge=0.0, le=100.0, description="Discount percent from 0 to 100")
    Quantity: int = Field(..., ge=1, le=50, description="Order quantity")
    Previous_Orders: int = Field(..., ge=0, le=200, description="Total previous orders placed by customer")
    Previous_Returns: int = Field(..., ge=0, le=200, description="Total previous returns made by customer")
    Customer_Rating: Optional[float] = Field(default=4.0, ge=1.0, le=5.0, description="Customer rating/reputation score")
    Delivery_Time: Optional[int] = Field(..., ge=1, le=60, description="Actual days taken for delivery")
    Expected_Delivery_Time: int = Field(..., ge=1, le=60, description="Promised/expected delivery days")
    Payment_Method: str = Field(..., description="Payment method used")
    Shipping_Method: str = Field(..., description="Shipping speed/method")
    Customer_Location: str = Field(..., description="Geographical region of customer")
    Product_Rating: float = Field(..., ge=1.0, le=5.0, description="Average review score of the product")
    Is_First_Order: str = Field(default="No", description="Yes or No")

class FactorContribution(BaseModel):
    feature: str
    contribution: float
    abs_contribution: float
    direction: str
    is_risk_increasing: bool

class PredictionResponse(BaseModel):
    prediction: int
    label: str
    return_probability: float
    no_return_probability: float
    return_probability_percent: float
    risk_level: str
    risk_color: str
    top_factors: List[FactorContribution]
    explanation_summary: List[str]
