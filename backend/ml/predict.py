"""
Inference and Prediction Explanation Service for Product Return Prediction.
Loads the persistent pipeline artifact and computes real-time predictions,
probabilities, risk tiers, and mathematically grounded local feature contributions.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

PIPELINE_PATH = "backend/models/return_prediction_pipeline.joblib"

class ReturnPredictor:
    def __init__(self, pipeline_path: str = PIPELINE_PATH):
        if not os.path.exists(pipeline_path):
            raise FileNotFoundError(f"Model pipeline not found at {pipeline_path}. Please train the model first.")
        self.pipeline = joblib.load(pipeline_path)
        self.preprocessor = self.pipeline.named_steps["preprocessor"]
        self.classifier = self.pipeline.named_steps["classifier"]
        
        # Cache feature names
        col_transformer = self.preprocessor.named_steps["col_transformer"]
        cat_pipeline = col_transformer.named_transformers_["cat"]
        onehot = cat_pipeline.named_steps["onehot"]
        
        from backend.ml.preprocessing import ALL_NUMERICAL_FEATURES, CATEGORICAL_FEATURES
        self.feature_names = list(ALL_NUMERICAL_FEATURES) + list(onehot.get_feature_names_out(CATEGORICAL_FEATURES))
        self.coefficients = self.classifier.coef_[0]
        self.intercept = float(self.classifier.intercept_[0])

    def predict_single(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes raw input dict, passes through pipeline, returns prediction,
        calibrated probabilities, risk categorization, and top contributing factors.
        """
        # Convert single input dict to DataFrame
        df_input = pd.DataFrame([input_data])
        
        # Compute predictions using the complete pipeline
        pred_class = int(self.pipeline.predict(df_input)[0])
        probabilities = self.pipeline.predict_proba(df_input)[0]
        prob_no_return = float(probabilities[0])
        prob_return = float(probabilities[1])

        # Risk level categorization
        if prob_return < 0.35:
            risk_level = "Low"
            risk_color = "green"
        elif prob_return < 0.65:
            risk_level = "Medium"
            risk_color = "amber"
        else:
            risk_level = "High"
            risk_color = "red"

        label = "Likely to be Returned" if pred_class == 1 else "Likely Not to be Returned"

        # Explain prediction via transformed features * coefficients (local log-odds contribution)
        transformed_vector = self.preprocessor.transform(df_input)
        if hasattr(transformed_vector, "toarray"):
            transformed_vector = transformed_vector.toarray()
        transformed_row = transformed_vector[0]

        contributions = []
        for name, coef, val in zip(self.feature_names, self.coefficients, transformed_row):
            impact = coef * val
            clean_name = name.replace("cat__", "").replace("num__", "").replace("_", " ")
            
            # Filter negligible or inactive one-hot features
            if abs(impact) > 0.02 or abs(val) > 0.05:
                direction = "increases return probability" if impact > 0 else "decreases return probability"
                contributions.append({
                    "feature": clean_name,
                    "contribution": round(float(impact), 4),
                    "abs_contribution": round(float(abs(impact)), 4),
                    "direction": direction,
                    "is_risk_increasing": bool(impact > 0)
                })

        # Sort contributions by absolute impact
        contributions.sort(key=lambda x: x["abs_contribution"], reverse=True)
        top_factors = contributions[:5]

        # Generate human-friendly reasoning bullets
        reasons = []
        for factor in top_factors:
            if factor["is_risk_increasing"]:
                reasons.append(f"{factor['feature'].title()} ({factor['direction']})")
            else:
                reasons.append(f"{factor['feature'].title()} ({factor['direction']})")

        return {
            "prediction": pred_class,
            "label": label,
            "return_probability": round(prob_return, 4),
            "no_return_probability": round(prob_no_return, 4),
            "return_probability_percent": round(prob_return * 100, 1),
            "risk_level": risk_level,
            "risk_color": risk_color,
            "top_factors": top_factors,
            "explanation_summary": reasons
        }

# Global singleton instance (lazy loaded)
_predictor_instance = None

def get_predictor() -> ReturnPredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = ReturnPredictor()
    return _predictor_instance
