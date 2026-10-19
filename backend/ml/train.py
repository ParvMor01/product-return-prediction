"""
Model Training and Hyperparameter Tuning for Product Return Prediction.
Demonstrates:
- 80/20 Stratified Train/Test Split (random_state=42)
- Zero Data Leakage Pipeline (ColumnTransformer + LogisticRegression)
- Baseline Model Comparison (DummyClassifier)
- 5-Fold Stratified Cross Validation
- GridSearchCV Hyperparameter Tuning
- Feature Importance / Coefficient Extraction
- Complete Artifact Persistence
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve, precision_recall_curve
)
from sklearn.model_selection import StratifiedKFold, cross_validate, GridSearchCV, train_test_split
from sklearn.pipeline import Pipeline

from backend.ml.preprocessing import (
    load_and_clean_data, create_preprocessor,
    TARGET_COLUMN, ID_COLUMN, ALL_NUMERICAL_FEATURES, CATEGORICAL_FEATURES
)

MODELS_DIR = "backend/models"
PIPELINE_PATH = os.path.join(MODELS_DIR, "return_prediction_pipeline.joblib")
METADATA_PATH = os.path.join(MODELS_DIR, "model_metadata.json")


def get_feature_names_from_preprocessor(preprocessor_step, X_sample: pd.DataFrame) -> list:
    """
    Extracts the human-readable feature names after ColumnTransformer one-hot encoding.
    """
    col_transformer = preprocessor_step.named_steps["col_transformer"]
    feature_names = []

    # Numerical features
    feature_names.extend(ALL_NUMERICAL_FEATURES)

    # Categorical features from OneHotEncoder
    cat_pipeline = col_transformer.named_transformers_["cat"]
    onehot_encoder = cat_pipeline.named_steps["onehot"]
    cat_feature_names = onehot_encoder.get_feature_names_out(CATEGORICAL_FEATURES).tolist()
    feature_names.extend(cat_feature_names)

    return feature_names


def train_and_evaluate(
    data_path: str = "backend/data/product_returns.csv",
    random_state: int = 42
) -> dict:
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    # 1. Load and clean raw dataset
    df, clean_report = load_and_clean_data(data_path)
    
    X = df.drop(columns=[TARGET_COLUMN, ID_COLUMN])
    y = df[TARGET_COLUMN].values
    
    # 2. Stratified Train-Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=random_state
    )
    
    print(f"Training set: {X_train.shape[0]} samples (Class 1: {np.mean(y_train):.1%})")
    print(f"Test set:     {X_test.shape[0]} samples (Class 1: {np.mean(y_test):.1%})")

    # 3. Baseline Model (Dummy Classifier - Majority Class)
    baseline_clf = DummyClassifier(strategy="most_frequent")
    baseline_clf.fit(X_train, y_train)
    baseline_y_pred = baseline_clf.predict(X_test)
    baseline_y_proba = baseline_clf.predict_proba(X_test)[:, 1]
    
    baseline_metrics = {
        "model_name": "Dummy Classifier (Baseline)",
        "accuracy": round(float(accuracy_score(y_test, baseline_y_pred)), 4),
        "precision": round(float(precision_score(y_test, baseline_y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, baseline_y_pred, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, baseline_y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, baseline_y_proba)), 4)
    }

    # 4. Logistic Regression Full Pipeline
    preprocessor = create_preprocessor()
    base_log_reg = LogisticRegression(max_iter=1000, random_state=random_state)
    
    full_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", base_log_reg)
    ])

    # 5. 5-Fold Stratified Cross-Validation on Training Data
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=random_state)
    cv_scoring = ["accuracy", "precision", "recall", "f1", "roc_auc"]
    cv_results = cross_validate(full_pipeline, X_train, y_train, cv=cv, scoring=cv_scoring, return_train_score=False)
    
    cv_summary = {
        "num_folds": 5,
        "mean_accuracy": round(float(np.mean(cv_results["test_accuracy"])), 4),
        "std_accuracy": round(float(np.std(cv_results["test_accuracy"])), 4),
        "mean_precision": round(float(np.mean(cv_results["test_precision"])), 4),
        "mean_recall": round(float(np.mean(cv_results["test_recall"])), 4),
        "mean_f1": round(float(np.mean(cv_results["test_f1"])), 4),
        "mean_roc_auc": round(float(np.mean(cv_results["test_roc_auc"])), 4),
        "fold_f1_scores": [round(float(s), 4) for s in cv_results["test_f1"]],
        "fold_roc_auc_scores": [round(float(s), 4) for s in cv_results["test_roc_auc"]]
    }
    print(f"5-Fold CV Mean F1: {cv_summary['mean_f1']} | Mean ROC-AUC: {cv_summary['mean_roc_auc']}")

    # 6. Hyperparameter Tuning using GridSearchCV on Training set
    param_grid = {
        "classifier__C": [0.05, 0.1, 0.5, 1.0, 5.0],
        "classifier__penalty": ["l2"],
        "classifier__solver": ["lbfgs"]
    }
    grid_search = GridSearchCV(
        estimator=full_pipeline,
        param_grid=param_grid,
        cv=cv,
        scoring="roc_auc",
        n_jobs=-1
    )
    grid_search.fit(X_train, y_train)
    best_params = grid_search.best_params_
    print(f"Best Hyperparameters: {best_params} (Best CV ROC-AUC: {grid_search.best_score_:.4f})")

    # Use the best tuned model
    best_pipeline = grid_search.best_estimator_

    # 7. Evaluate Best Pipeline on Untouched Test Set
    y_test_pred = best_pipeline.predict(X_test)
    y_test_proba = best_pipeline.predict_proba(X_test)[:, 1]

    test_accuracy = accuracy_score(y_test, y_test_pred)
    test_precision = precision_score(y_test, y_test_pred, zero_division=0)
    test_recall = recall_score(y_test, y_test_pred, zero_division=0)
    test_f1 = f1_score(y_test, y_test_pred, zero_division=0)
    test_roc_auc = roc_auc_score(y_test, y_test_proba)

    # Confusion Matrix
    cm = confusion_matrix(y_test, y_test_pred)
    cm_dict = {
        "tn": int(cm[0, 0]),
        "fp": int(cm[0, 1]),
        "fn": int(cm[1, 0]),
        "tp": int(cm[1, 1])
    }

    # ROC Curve points (downsampled to 30 points for smooth frontend chart)
    fpr, tpr, roc_thresholds = roc_curve(y_test, y_test_proba)
    step = max(1, len(fpr) // 30)
    roc_points = [
        {"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
        for f, t in zip(fpr[::step], tpr[::step])
    ]
    if roc_points[-1]["fpr"] != 1.0:
        roc_points.append({"fpr": 1.0, "tpr": 1.0})

    # Precision-Recall Curve points
    prec_pts, rec_pts, _ = precision_recall_curve(y_test, y_test_proba)
    pr_step = max(1, len(prec_pts) // 30)
    pr_points = [
        {"recall": round(float(r), 4), "precision": round(float(p), 4)}
        for r, p in zip(rec_pts[::pr_step], prec_pts[::pr_step])
    ]

    # 8. Extract Feature Importance / Coefficients
    fitted_preprocessor = best_pipeline.named_steps["preprocessor"]
    fitted_classifier = best_pipeline.named_steps["classifier"]
    
    feature_names = get_feature_names_from_preprocessor(fitted_preprocessor, X_train)
    coefficients = fitted_classifier.coef_[0]
    intercept = float(fitted_classifier.intercept_[0])

    features_coef_list = []
    for name, coef in zip(feature_names, coefficients):
        clean_name = name.replace("cat__", "").replace("num__", "")
        features_coef_list.append({
            "feature": clean_name,
            "raw_feature": name,
            "coefficient": round(float(coef), 4),
            "odds_ratio": round(float(np.exp(coef)), 4),
            "abs_impact": round(float(abs(coef)), 4),
            "direction": "Increases Return Risk" if coef > 0 else "Decreases Return Risk"
        })

    # Sort by absolute coefficient impact
    features_coef_list.sort(key=lambda x: x["abs_impact"], reverse=True)

    # 9. Save Artifacts
    joblib.dump(best_pipeline, PIPELINE_PATH)
    print(f"Fitted pipeline saved to {PIPELINE_PATH}")

    metadata = {
        "status": "ready",
        "cleaning_report": clean_report,
        "dataset_split": {
            "total_records": len(df),
            "train_size": len(X_train),
            "test_size": len(X_test),
            "test_split_ratio": 0.20,
            "random_state": random_state
        },
        "baseline_comparison": baseline_metrics,
        "cross_validation": cv_summary,
        "hyperparameter_tuning": {
            "param_grid": param_grid,
            "best_params": best_params,
            "best_cv_score": round(float(grid_search.best_score_), 4),
            "tuning_metric": "roc_auc"
        },
        "test_metrics": {
            "accuracy": round(float(test_accuracy), 4),
            "precision": round(float(test_precision), 4),
            "recall": round(float(test_recall), 4),
            "f1": round(float(test_f1), 4),
            "roc_auc": round(float(test_roc_auc), 4)
        },
        "confusion_matrix": cm_dict,
        "roc_curve": roc_points,
        "pr_curve": pr_points,
        "intercept": round(intercept, 4),
        "top_features": features_coef_list[:12],
        "all_features": features_coef_list
    }

    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Model metadata saved to {METADATA_PATH}")

    return metadata

if __name__ == "__main__":
    train_and_evaluate()
