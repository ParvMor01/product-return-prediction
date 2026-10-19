# Rules — Product Return Prediction

## 1. Core Rule
Build a genuine predictive analytics project. Never replace machine-learning functionality with hardcoded outputs or fake UI values.

## 2. Approved ML Stack
Use:
- Python
- pandas
- NumPy
- scikit-learn
- joblib

Primary algorithm:
- Logistic Regression

Allowed supporting techniques from the syllabus:
- Train/test split
- Cross-validation
- GridSearchCV
- Feature engineering
- Feature selection
- Standard preprocessing
- Accuracy, Precision, Recall, F1, ROC-AUC

## 3. Avoid
Do not introduce complex algorithms such as:
- Deep learning
- Transformers
- XGBoost
- LightGBM
- Random Forest
- SVM
- ARIMA/SARIMA

unless explicitly requested later.

The goal is syllabus alignment and easy viva defense, not algorithm quantity.

## 4. Data Rules
- Never use the target variable as an input feature.
- Never use information that becomes available only after a return occurs.
- Split data before fitting preprocessing transformations.
- Fit imputers, scalers, and encoders only on training data.
- Use the same fitted pipeline during inference.
- Remove duplicate records where appropriate.
- Do not silently delete large portions of the dataset.
- Report important preprocessing decisions.

## 5. Synthetic Data Rule
If a public dataset cannot be used, synthetic data is acceptable for demonstration.

However:
- Clearly label it as synthetic.
- Make relationships plausible.
- Do not pretend synthetic results represent real-world performance.
- Do not randomly assign the target without meaningful relationships.

## 6. Model Rules
- Use `random_state` for reproducibility.
- Use stratified train/test splitting for classification.
- Use 5-fold cross-validation.
- Use GridSearchCV for simple Logistic Regression tuning.
- Report test-set metrics separately from cross-validation metrics.
- Never tune against the test set.

## 7. Evaluation Rules
Never claim that accuracy alone proves the model is good.

Show:
- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- Confusion matrix
- ROC curve

Interpret metrics according to the return-prediction context.

## 8. Interpretation Rules
Do not claim that a predictive relationship is causal.

Use wording such as:
- "associated with"
- "predictive of"
- "the model assigns higher probability when..."

Avoid:
- "this factor causes returns"

unless supported by an appropriate causal analysis, which is outside this project.

## 9. UI Rules
- Keep the UI clean and professional.
- Avoid excessive animations.
- Avoid unnecessary gradients.
- Avoid fake loading screens.
- Do not display fake statistics.
- Charts must be generated from actual backend data.

## 10. Error Handling
- Validate API input.
- Return meaningful errors.
- Do not expose stack traces to normal users.
- Log useful developer information.
- If the model file is missing, show a clear setup/training error.

## 11. Code Rules
- Keep frontend and backend responsibilities separate.
- Keep ML logic separate from API routing.
- Use reusable functions.
- Avoid duplicate code.
- Prefer readable code over clever code.
- Do not rewrite working modules unnecessarily.

## 12. Dependency Rules
Do not add a new dependency unless it solves a real project requirement.

When adding one:
1. Update requirements/package files.
2. Use it consistently.
3. Document why it is needed if non-obvious.

## 13. AI Agent Rules
Before modifying code:
- Inspect the relevant existing implementation.
- Preserve working functionality.
- Do not blindly overwrite files.
- Do not fabricate completed work.
- Test changes before declaring them complete.

If something cannot be implemented correctly, state the limitation instead of pretending it works.

## 14. Academic Integrity
The application should help demonstrate the student's understanding.

Include simple explanations of:
- Logistic Regression
- Sigmoid function
- Train/test split
- Cross-validation
- F1-score
- ROC-AUC
- Overfitting
- Feature engineering

## 15. Scope Control
Do not add authentication, payments, cloud deployment, databases, or unrelated features unless explicitly requested. The project is primarily a Predictive Analysis academic demonstration.
