"""
Preprocessing Pipeline for Product Return Prediction.
Implements custom feature engineering, imputation, encoding, and scaling
strictly following scikit-learn's Pipeline and ColumnTransformer conventions
to ensure ZERO data leakage.
"""

from typing import Tuple, List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Core raw feature definitions
NUMERICAL_RAW_FEATURES = [
    "Customer_Age",
    "Product_Price",
    "Discount_Percentage",
    "Quantity",
    "Previous_Orders",
    "Previous_Returns",
    "Customer_Rating",
    "Delivery_Time",
    "Expected_Delivery_Time",
    "Product_Rating"
]

CATEGORICAL_FEATURES = [
    "Customer_Gender",
    "Product_Category",
    "Payment_Method",
    "Shipping_Method",
    "Customer_Location",
    "Is_First_Order"
]

ENGINEERED_FEATURES = [
    "Delivery_Delay",
    "Previous_Return_Rate",
    "Effective_Price",
    "Total_Order_Value"
]

ALL_NUMERICAL_FEATURES = NUMERICAL_RAW_FEATURES + ENGINEERED_FEATURES
TARGET_COLUMN = "Return_Status"
ID_COLUMN = "Order_ID"


class ECommerceFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Scikit-learn compliant transformer that engineers domain-specific features:
    1. Delivery_Delay = Delivery_Time - Expected_Delivery_Time
    2. Previous_Return_Rate = Previous_Returns / (Previous_Orders + 1.0)
    3. Effective_Price = Product_Price * (1.0 - Discount_Percentage / 100.0)
    4. Total_Order_Value = Effective_Price * Quantity
    """
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X_df = X.copy()
        if not isinstance(X_df, pd.DataFrame):
            # If array or dict was passed
            X_df = pd.DataFrame(X_df)

        # 1. Delivery delay (actual - expected)
        # Handle cases where Delivery_Time might be NaN by keeping NaN until imputer
        dt = pd.to_numeric(X_df.get("Delivery_Time", 0), errors="coerce")
        edt = pd.to_numeric(X_df.get("Expected_Delivery_Time", 0), errors="coerce")
        X_df["Delivery_Delay"] = dt - edt

        # 2. Previous return behavior
        po = pd.to_numeric(X_df.get("Previous_Orders", 0), errors="coerce").fillna(0)
        pr = pd.to_numeric(X_df.get("Previous_Returns", 0), errors="coerce").fillna(0)
        X_df["Previous_Return_Rate"] = pr / (po + 1.0)

        # 3. Effective product price after discount
        price = pd.to_numeric(X_df.get("Product_Price", 0), errors="coerce").fillna(0)
        disc = pd.to_numeric(X_df.get("Discount_Percentage", 0), errors="coerce").fillna(0)
        eff_price = price * (1.0 - disc / 100.0)
        X_df["Effective_Price"] = eff_price

        # 4. Total Order Value
        qty = pd.to_numeric(X_df.get("Quantity", 1), errors="coerce").fillna(1)
        X_df["Total_Order_Value"] = eff_price * qty

        return X_df


def create_preprocessor() -> Pipeline:
    """
    Creates the complete preprocessing pipeline:
    1. Feature Engineering
    2. ColumnTransformer (Numerical Imputation + Scaling, Categorical Imputation + OHE)
    """
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    col_transformer = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, ALL_NUMERICAL_FEATURES),
            ("cat", cat_pipeline, CATEGORICAL_FEATURES)
        ],
        remainder="drop"
    )

    full_preprocessor = Pipeline([
        ("feature_engineer", ECommerceFeatureEngineer()),
        ("col_transformer", col_transformer)
    ])

    return full_preprocessor


def load_and_clean_data(filepath: str = "backend/data/product_returns.csv") -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Loads raw CSV data and performs initial data hygiene:
    - Reports duplicate count and removes duplicates
    - Reports missing values before and after
    - Separates target variable
    """
    df_raw = pd.read_csv(filepath)
    initial_rows = len(df_raw)
    
    # Missing values before cleaning
    missing_before = df_raw.isnull().sum().to_dict()
    duplicates_count = int(df_raw.duplicated().sum())

    # Remove duplicates
    df_clean = df_raw.drop_duplicates().reset_index(drop=True)
    clean_rows = len(df_clean)

    cleaning_report = {
        "initial_rows": initial_rows,
        "clean_rows": clean_rows,
        "duplicates_removed": duplicates_count,
        "missing_before": missing_before,
        "missing_after_dedup": df_clean.isnull().sum().to_dict()
    }

    return df_clean, cleaning_report
