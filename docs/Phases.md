# Phases — Product Return Prediction

## Phase 0 — Project Foundation
### Goal
Create the project structure and development environment.

### Tasks
- Create frontend and backend structure.
- Configure React/Vite.
- Configure Python environment.
- Create FastAPI application.
- Create requirements files.
- Add README and documentation.
- Add health endpoint.
- Verify frontend/backend startup.

### Completion
Both frontend and backend run locally.

---

## Phase 1 — Dataset and Data Pipeline
### Goal
Establish reliable project data.

### Tasks
- Select or create the product-return dataset.
- Validate columns and target.
- Remove duplicates.
- Analyze missing values.
- Identify numerical/categorical columns.
- Identify potential outliers.
- Document target distribution.
- Build reusable preprocessing pipeline.

### Completion
Dataset loads and preprocessing runs without errors or leakage.

---

## Phase 2 — Exploratory Data Analysis
### Goal
Understand the dataset.

### Tasks
- Calculate descriptive statistics.
- Return/non-return distribution.
- Category return rates.
- Delivery-time analysis.
- Rating analysis.
- Discount analysis.
- Previous-return analysis.
- Generate clean charts.
- Create short interpretations.

### Completion
EDA page displays actual dataset-based charts.

---

## Phase 3 — Logistic Regression Model
### Goal
Build the primary predictive model.

### Tasks
- Create train/test split.
- Build preprocessing + Logistic Regression pipeline.
- Train baseline model.
- Run 5-fold cross-validation.
- Evaluate test data.
- Calculate Accuracy, Precision, Recall, F1 and ROC-AUC.
- Generate confusion matrix and ROC curve.

### Completion
Model produces reproducible evaluation results.

---

## Phase 4 — Hyperparameter Tuning
### Goal
Improve/validate model configuration.

### Tasks
- Define a small parameter grid.
- Run GridSearchCV.
- Select best parameters using training cross-validation.
- Evaluate tuned model once on the untouched test set.
- Compare baseline vs tuned model.
- Save the final pipeline.

### Completion
Final model is selected using a defensible process.

---

## Phase 5 — Prediction API
### Goal
Expose real model predictions to the frontend.

### Tasks
- Create prediction schema.
- Validate inputs.
- Load saved pipeline.
- Implement `predict()` and `predict_proba()`.
- Calculate risk level.
- Return prediction and probabilities.
- Add controlled error handling.

### Completion
POST `/api/predict` returns genuine model-generated results.

---

## Phase 6 — Analytics Backend
### Goal
Expose project analytics to the UI.

### Tasks
Implement:
- Summary endpoint
- Dataset endpoint
- EDA endpoint
- Model metrics endpoint
- Feature/coefficient endpoint
- Health endpoint

### Completion
Frontend can retrieve all required project data through APIs.

---

## Phase 7 — Frontend Dashboard
### Goal
Build the main analytics interface.

### Tasks
- Create navigation.
- Build dashboard.
- Add KPI cards.
- Add charts.
- Add dataset preview.
- Add preprocessing explanation.
- Add model metrics.

### Completion
Dashboard presents the project clearly.

---

## Phase 8 — Prediction Interface
### Goal
Create the live prediction experience.

### Tasks
- Build prediction form.
- Add validation.
- Connect to backend.
- Display prediction.
- Display return probability.
- Display risk level.
- Display model-based contributing factors where supported.

### Completion
A user can enter an order and receive a genuine prediction.

---

## Phase 9 — Insights and Academic Explanation
### Goal
Make the project easy to explain in a viva.

### Tasks
Add:
- Project workflow
- Logistic Regression explanation
- Sigmoid explanation
- Cross-validation explanation
- Metric explanations
- Overfitting/underfitting explanation
- Feature interpretation
- Business insights

### Completion
Every major project decision has a short understandable explanation.

---

## Phase 10 — Testing and Validation
### Goal
Verify the complete application.

### Tasks
- Test backend endpoints.
- Test prediction form.
- Test invalid inputs.
- Test missing model behavior.
- Verify charts.
- Verify metrics.
- Check for hardcoded values.
- Check for data leakage.
- Check responsive layout.
- Test clean startup from README instructions.

### Completion
No critical bugs remain.

---

## Phase 11 — Final Academic Packaging
### Goal
Prepare for demonstration/submission.

### Tasks
- Final README.
- Final requirements.
- Project screenshots if needed.
- Model methodology summary.
- Dataset summary.
- 10–20 likely viva questions.
- Final project workflow.
- Final known limitations.
- Future improvements.

### Completion
The project can be demonstrated to a teacher from start to finish.

---

## Phase Execution Rule
Complete one phase at a time.

After each phase:
1. Test it.
2. Fix errors.
3. Update Memory.md.
4. Only then move to the next phase.

Do not implement all phases at once unless explicitly instructed.
