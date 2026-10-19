# Architecture — Product Return Prediction

## 1. Architecture Summary
The application uses a simple frontend/backend/ML architecture.

**Flow:**

User → Frontend → Backend API → Preprocessing Pipeline → Logistic Regression Model → Prediction → Frontend

For analytics pages:

Dataset → Data Processing → EDA/Statistics → Backend → Frontend Charts

## 2. Recommended Technical Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Recharts for charts where useful

### Backend
- Python
- FastAPI

### Machine Learning
- pandas
- NumPy
- scikit-learn
- joblib

### Development
- Git
- Python virtual environment
- npm

Avoid unnecessary frameworks.

## 3. Suggested Folder Structure

```text
product-return-prediction/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── ml/
│   │   ├── preprocessing.py
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   └── predict.py
│   ├── models/
│   │   └── return_prediction_pipeline.joblib
│   ├── data/
│   │   └── product_returns.csv
│   └── requirements.txt
│
├── notebooks/
│   └── exploratory_analysis.ipynb
│
├── docs/
│   ├── PRD.md
│   ├── Architecture.md
│   ├── Rules.md
│   ├── Phases.md
│   ├── Design.md
│   └── Memory.md
│
├── README.md
└── .gitignore
```

## 4. Backend Responsibilities
The backend should:
- Load model artifacts
- Validate prediction inputs
- Serve dataset statistics
- Serve EDA data
- Serve evaluation metrics
- Serve feature/coefficient information
- Return predictions and probabilities
- Handle errors consistently

## 5. ML Pipeline
Training flow:

```text
Raw Dataset
    ↓
Validation
    ↓
Duplicate Removal
    ↓
Missing Value Handling
    ↓
Feature/Target Separation
    ↓
Train-Test Split
    ↓
ColumnTransformer
    ├── Numerical: Imputation → Scaling
    └── Categorical: Imputation → OneHotEncoding
    ↓
Logistic Regression
    ↓
Cross Validation / Grid Search
    ↓
Final Test Evaluation
    ↓
Save Full Pipeline
```

The full preprocessing + model pipeline must be saved together so prediction uses exactly the same transformations as training.

## 6. API Endpoints

Recommended endpoints:

- `GET /api/health`
- `GET /api/summary`
- `GET /api/dataset`
- `GET /api/eda`
- `GET /api/model/metrics`
- `GET /api/model/features`
- `POST /api/predict`

Example prediction response:

```json
{
  "prediction": 1,
  "label": "Likely to be Returned",
  "return_probability": 0.78,
  "no_return_probability": 0.22,
  "risk_level": "High"
}
```

## 7. Frontend Pages

- Dashboard
- Dataset
- Preprocessing
- EDA
- Model
- Prediction
- Insights
- About

## 8. Data Flow for Prediction

```text
Prediction Form
      ↓
Frontend validation
      ↓
POST /api/predict
      ↓
Backend schema validation
      ↓
Saved preprocessing + model pipeline
      ↓
predict_proba()
      ↓
Risk classification
      ↓
JSON response
      ↓
Prediction Result UI
```

## 9. Security and Reliability
This is a local academic project, so enterprise authentication is unnecessary unless later requested.

Still:
- Validate all inputs.
- Never execute user input as code.
- Never expose server file paths unnecessarily.
- Return controlled API errors.
