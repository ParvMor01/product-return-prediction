# Product Return Prediction using Predictive Analytics

A complete, end-to-end academic web application and predictive analytics system designed to predict whether an e-commerce order is likely to be returned based on customer, product, order, and delivery-related attributes.

The primary machine learning technique implemented is **Logistic Regression**, aligning strictly with the university Predictive Analysis syllabus. The project demonstrates the entire data science and analytics lifecycle with **zero data leakage**, full preprocessing pipeline encapsulation, cross-validation, and local explainability.

---

## 1. Project Overview
- **Title:** Product Return Prediction using Predictive Analytics
- **Domain:** E-Commerce Predictive Analytics & Reverse Logistics Risk Management
- **Task:** Binary Classification
- **Target Variable:** `Return_Status` (0 = Not Returned / Retained, 1 = Returned)
- **Primary Algorithm:** Logistic Regression (L2-Regularized with L-BFGS solver)
- **Architecture:** Decoupled FastAPI REST backend + React 18 / Vite Analytics Dashboard

---

## 2. Key Features
- **Executive Analytics Dashboard:** KPI tracking (Total Orders, Return Rate, Model Accuracy, F1-Score, ROC-AUC) and empirical distribution charts.
- **Dataset Exploration & Hygiene:** Feature modality tables, missing-value audit before/after cleaning, and interactive dataset preview.
- **Zero-Leakage Preprocessing:** `ColumnTransformer` handling median numerical imputation, modal categorical imputation, standard scaling, and one-hot encoding, fitted solely on `X_train`.
- **Domain Feature Engineering:** Automatic synthesis of `Delivery_Delay`, `Previous_Return_Rate`, `Effective_Price`, and `Total_Order_Value`.
- **Exploratory Data Analysis (EDA):** 8 publication-quality charts examining category returns, delivery timeliness, product ratings, discounts, customer age, and Pearson correlations.
- **Model Training & Tuning:** Stratified 80/20 split, comparison against majority-class baseline (`DummyClassifier`), 5-Fold Stratified Cross-Validation, and `GridSearchCV` hyperparameter tuning ($C=0.05$).
- **Model Evaluation:** Confusion Matrix (TN, FP, FN, TP), Type I vs. Type II error analysis, ROC curve with AUC score, Precision, Recall, and F1-Score.
- **Live Risk Predictor:** Interactive 3-section prediction form with 1-click test presets, calibrated return probability via the sigmoid function, risk level classification (Low/Medium/High), and local feature contribution explanations (log-odds impact).
- **Academic Viva Guide:** 14 structured viva voce questions and theoretical definitions tailored for evaluation.

---

## 3. Technology Stack

| Layer | Technologies Used | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, Recharts, Lucide Icons | Responsive modern analytics UI |
| **Backend API** | Python 3.12, FastAPI, Uvicorn, Pydantic | RESTful API, schema validation, static file serving |
| **Machine Learning** | scikit-learn, pandas, NumPy, joblib, SciPy | Pipeline, ColumnTransformer, LogisticRegression, GridSearchCV |
| **Testing** | pytest, httpx, TestClient | Automated test suite for endpoints and pipeline |
| **DevOps** | uv, npm | Deterministic package management |

---

## 4. Dataset Description
The dataset contains **3,500 records** representing realistic commercial e-commerce order logs with realistic domain relationships:

| Feature Name | Type | Description |
|---|---|---|
| `Order_ID` | String | Unique transactional identifier (excluded from training) |
| `Customer_Age` | Integer | Customer age (18 - 72 years) |
| `Customer_Gender` | Categorical | Female, Male, Other |
| `Product_Category` | Categorical | Apparel, Footwear, Electronics, Home & Kitchen, Beauty & Personal Care, Books |
| `Product_Price` | Float | Item purchase price ($12 - $1,400) |
| `Discount_Percentage`| Float | Promotional markdown (0% - 60%) |
| `Quantity` | Integer | Units ordered (1 - 5) |
| `Previous_Orders` | Integer | Historical orders placed by customer |
| `Previous_Returns` | Integer | Historical returns made by customer |
| `Customer_Rating` | Float | Customer rating score (1.0 - 5.0) |
| `Delivery_Time` | Integer | Actual days taken for delivery |
| `Expected_Delivery_Time` | Integer | Promised delivery SLA in days |
| `Payment_Method` | Categorical | Credit Card, Debit Card, UPI, Cash on Delivery |
| `Shipping_Method` | Categorical | Standard, Express, Same Day, Economy |
| `Customer_Location` | Categorical | North, South, East, West, Central |
| `Product_Rating` | Float | Average product review score (1.0 - 5.0) |
| `Is_First_Order` | Categorical | Yes / No |
| `Return_Status` | Binary | **Target:** 0 = Retained, 1 = Returned (~30.2% positive rate) |

---

## 5. Predictive Analytics Pipeline & Workflow

```text
Raw E-Commerce Orders
         ↓
Data Hygiene & Deduplication (Exact duplicates removed, Order_ID dropped)
         ↓
Stratified Train-Test Split (80% Train: 2,800 rows / 20% Holdout: 700 rows, seed=42)
         ↓
Custom Feature Engineering (Delivery Delay, Previous Return Ratio, Effective Price)
         ↓
ColumnTransformer (Zero Leakage)
  ├── Numerical: SimpleImputer(median) → StandardScaler()
  └── Categorical: SimpleImputer(most_frequent) → OneHotEncoder(handle_unknown='ignore')
         ↓
Logistic Regression Classifier (L2 Penalty, L-BFGS Solver)
         ↓
5-Fold Stratified Cross-Validation on Training Split
         ↓
GridSearchCV Hyperparameter Optimization (C = 0.05 selected)
         ↓
Holdout Test Set Evaluation (Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix)
         ↓
Pipeline Persistence (return_prediction_pipeline.joblib & model_metadata.json)
         ↓
FastAPI Serving & React Interactive Dashboard
```

---

## 6. Installation & Quick Start

### Prerequisites
- Python 3.10+ (tested on Python 3.12)
- Node.js 18+ and npm
- `uv` (recommended) or standard `python -m venv` / `pip`

### Step 1: Clone and Set Up Virtual Environment

```bash
cd /Users/parv/Desktop/Predective

# Using uv (fastest)
uv venv backend/.venv --python 3.12
source backend/.venv/bin/activate
uv pip install -r backend/requirements.txt

# Or using standard python
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

### Step 2: (Optional) Retrain Model from Scratch

```bash
PYTHONPATH=. backend/.venv/bin/python backend/ml/train.py
```

### Step 3: Run the Complete Application (Single Server Mode)

The FastAPI server automatically serves both the API and the compiled React dashboard at `http://localhost:8000`:

```bash
PYTHONPATH=. backend/.venv/bin/python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Open your browser to: **`http://localhost:8000`**

### Step 4: (Optional) Frontend Development Mode with Hot Reload

If you wish to modify the React frontend with Vite HMR:

```bash
cd frontend
npm install
npm run dev
```

Open: **`http://localhost:5173`** (Vite automatically proxies API requests to port 8000).

---

## 7. Model Evaluation Results

Evaluated on the **unseen 20% holdout test set** (700 orders):

| Evaluation Metric | Baseline (Dummy Classifier) | Logistic Regression (Ours) | Syllabus Rationale |
|---|---|---|---|
| **Accuracy** | 69.7% | **70.3%** | Overall fraction of correct predictions |
| **Precision** | 0.0% | **52.6%** | Reliability of positive return predictions |
| **Recall** | 0.0% | **18.9%** | Sensitivity in identifying true returns |
| **F1-Score** | 0.000 | **0.278** | Harmonic balance between Precision and Recall |
| **ROC-AUC** | 0.500 | **0.668** | Discrimination power across all threshold cutoffs |
| **5-Fold CV ROC-AUC** | 0.500 | **0.705** | Generalization score across resampled folds |

### Confusion Matrix on Test Split
- **True Negatives (TN):** 452 (Retained correctly identified)
- **False Positives (FP):** 36 (Type I Error / False alarm)
- **False Negatives (FN):** 172 (Type II Error / Missed return)
- **True Positives (TP):** 40 (Returns successfully detected)

---

## 8. Top Predictive Factors (Model Coefficients)

Standardized coefficients ($\beta$) from Logistic Regression:

1. **`Product_Category_Apparel` ($\beta = +0.55$, Odds Ratio = 1.74x):** Sizing uncertainty and tactile fabric evaluation increase return risk.
2. **`Product_Category_Books` ($\beta = -0.45$, Odds Ratio = 0.64x):** Fixed physical dimensions and explicit content decrease return probability.
3. **`Previous_Return_Rate` ($\beta = +0.42$, Odds Ratio = 1.52x):** Habitual return behavior strongly predicts subsequent returns.
4. **`Product_Category_Footwear` ($\beta = +0.39$, Odds Ratio = 1.48x):** Sizing and fit comfort discrepancies elevate return risk.
5. **`Product_Rating` ($\beta = -0.33$, Odds Ratio = 0.72x):** High catalog ratings correlate with superior product satisfaction and lower return probability.
6. **`Payment_Method_Cash on Delivery` ($\beta = +0.26$, Odds Ratio = 1.29x):** Lack of upfront financial commitment increases order refusal and return rates.
7. **`Delivery_Delay` ($\beta = +0.23$, Odds Ratio = 1.25x):** Longer delivery delays reduce buyer enthusiasm and increase cancellation/return rates.

---

## 9. Automated Testing

Run the automated test suite with pytest:

```bash
PYTHONPATH=. backend/.venv/bin/pytest backend/tests/test_api.py -v
```

All 7 test cases verify health, summary metrics, dataset schema, EDA calculations, model metrics, and high/low risk inference.

---

## 10. Common College Viva Voce Questions

1. **Why Logistic Regression instead of Linear Regression?**  
   Linear regression generates unbounded outputs ($-\infty$ to $+\infty$), violating probability axioms. Logistic regression applies the sigmoid function $\sigma(z) = 1 / (1 + e^{-z})$ to map linear combinations of features into bounded probabilities $[0, 1]$.
2. **What does the Odds Ratio mean?**  
   The Odds Ratio is $\exp(\beta_i)$. For every 1-unit standard deviation increase in feature $x_i$, the odds of an order being returned are multiplied by $\exp(\beta_i)$, assuming all other features remain constant.
3. **What is Data Leakage and how did you prevent it?**  
   Data leakage occurs when information outside the training set influences feature transformations. We split the dataset into 80% train and 20% test sets *before* performing any imputation or scaling, fitting all `ColumnTransformer` scalers and encoders exclusively on $X_{\text{train}}$.
4. **Why not judge the model only on Accuracy?**  
   With a ~70/30 class imbalance, a naive classifier that predicts "Not Returned" for every order achieves 70% accuracy while failing to detect any returns. Precision, Recall, and ROC-AUC measure true predictive value.
5. **How does parameter $C$ control overfitting?**  
   $C$ is the inverse of regularization strength ($C = 1/\lambda$). A smaller $C$ (such as our tuned value $0.05$) applies stronger L2 weight shrinkage to prevent coefficients from growing excessively large, reducing model variance and mitigating overfitting.

---

## 11. Future Improvements
- Implement cost-sensitive learning or threshold optimization (tuning decision threshold below 0.50) to maximize recall for high-cost reverse logistics.
- Integrate A/B testing frameworks to validate whether pre-delivery vouchers reduce return rates on delayed orders.
- Expand to multi-class classification predicting specific return reasons (e.g. "Wrong Size", "Defective Item", "Late Delivery").
