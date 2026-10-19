# PRD — Product Return Prediction

## 1. Project Overview
**Project:** Product Return Prediction using Predictive Analytics

The project is a web-based predictive analytics application that predicts whether an e-commerce order is likely to be returned. The primary machine-learning technique is Logistic Regression, supported by the predictive analytics concepts in the university syllabus.

## 2. Problem Statement
E-commerce businesses face significant costs from product returns. The application will analyze historical order/customer/product data and predict the probability that a new order will be returned.

## 3. Target Users
- College students demonstrating a Predictive Analysis project
- Faculty evaluating the project
- Demonstration users entering hypothetical order details

## 4. Goals
- Demonstrate a complete predictive analytics pipeline.
- Use a real or realistically structured dataset.
- Apply Logistic Regression for binary classification.
- Make preprocessing and model evaluation transparent.
- Provide an understandable prediction interface.
- Produce useful analytical insights without claiming causation.

## 5. Core Features

### 5.1 Dashboard
Show:
- Total orders
- Returned orders
- Overall return rate
- Accuracy
- F1-score
- ROC-AUC
- Key charts and insights

### 5.2 Dataset Overview
Show:
- Dataset size
- Feature count
- Target variable
- Numerical/categorical features
- Missing values
- Sample records

### 5.3 Data Preprocessing
Demonstrate:
- Duplicate removal
- Missing-value handling
- Appropriate outlier treatment
- Categorical encoding
- Numerical scaling
- Leakage prevention

### 5.4 Exploratory Data Analysis
Include useful visualizations such as:
- Return vs non-return distribution
- Return rate by product category
- Return rate vs delivery time
- Return rate vs product rating
- Return rate vs discount
- Return rate vs previous returns

### 5.5 Model Training
Primary model:
- Logistic Regression

Include:
- Train/test split
- Stratification
- 5-fold cross-validation
- GridSearchCV for simple hyperparameter tuning

### 5.6 Model Evaluation
Show:
- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix
- ROC-AUC
- ROC curve

### 5.7 Prediction
Allow users to enter order information and receive:
- Return prediction
- Return probability
- No-return probability
- Risk level: Low / Medium / High
- Short model-based explanation of influential inputs

### 5.8 Insights
Calculate insights from the actual dataset/model:
- High-return categories
- Relationship with delivery delay
- Relationship with ratings
- Previous-return behavior
- Discount patterns
- Important predictive features

## 6. Dataset
Recommended fields:
- Order ID
- Customer Age
- Customer Gender
- Product Category
- Product Price
- Discount Percentage
- Quantity
- Previous Orders
- Previous Returns
- Customer Rating
- Delivery Time
- Expected Delivery Time
- Payment Method
- Shipping Method
- Region
- Product Rating
- Is First Order
- Return Status

Target:
`Return_Status` — 0 = Not Returned, 1 = Returned

Do not use post-return information as a predictive feature.

## 7. Non-Functional Requirements
- Responsive UI
- Reproducible model training
- No hardcoded prediction results
- Clear error messages
- Maintainable code
- Local development should work from documented commands
- Model and preprocessing pipeline must be saved/reused consistently

## 8. Success Criteria
The project is complete when:
1. The app starts successfully.
2. Dataset loads successfully.
3. Preprocessing runs without leakage.
4. Logistic Regression trains successfully.
5. Cross-validation and GridSearchCV work.
6. Metrics are calculated from the actual test set.
7. Prediction form returns model-generated probabilities.
8. Charts use real project data.
9. README contains setup/run instructions.
10. The application can be demonstrated live to a faculty member.
