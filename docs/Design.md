# Design — Product Return Prediction

## 1. Design Direction
The interface should look like a modern data analytics product, not a generic college template.

Visual direction:
- Clean
- Professional
- Minimal
- Data-focused
- Easy to navigate
- Academic but polished

## 2. Color System

### Primary
- Deep Navy: `#172033`

### Primary Accent
- Blue: `#2563EB`

### Success
- Green: `#16A34A`

### Warning
- Amber: `#D97706`

### Danger
- Red: `#DC2626`

### Background
- `#F8FAFC`

### Surface
- `#FFFFFF`

### Main Text
- `#0F172A`

### Secondary Text
- `#64748B`

### Border
- `#E2E8F0`

Use colors consistently. Do not introduce random colors.

## 3. Typography
Preferred font:
- Inter

Fallback:
- system-ui
- sans-serif

### Typography hierarchy
Page title:
- 28–36px
- semibold/bold

Section title:
- 20–24px
- semibold

Card title:
- 14–16px
- medium/semibold

Body:
- 14–16px

Small metadata:
- 12–13px

Avoid excessive font sizes.

## 4. Layout
Use:
- Maximum content width around 1400px
- Comfortable spacing
- Responsive grid
- Consistent card padding
- Clear visual hierarchy

Desktop:
- Sidebar/navigation + main content

Tablet:
- Collapsible navigation

Mobile:
- Stacked cards
- Horizontally scrollable charts where required

## 5. Navigation
Recommended navigation:

Dashboard
Dataset
Preprocessing
EDA
Model
Prediction
Insights
About

The active section should be visually obvious.

## 6. Dashboard
Top area:
- Page title
- Short project description

KPI row:
- Total Orders
- Return Rate
- Returned Orders
- F1 Score
- ROC-AUC

Below:
- Return distribution
- Category return chart
- Important factors
- Short insight cards

## 7. Charts
Charts should:
- Have clear titles.
- Use readable axis labels.
- Avoid unnecessary decoration.
- Use tooltips when helpful.
- Have consistent sizing.
- Show actual backend data.

Recommended charts:
- Donut/bar chart for return distribution
- Bar chart for category return rate
- Line/scatter visualization for delivery time vs returns
- Bar chart for feature importance/coefficient magnitude
- ROC curve on model page

## 8. Prediction Page
The prediction form should be divided into logical groups:

### Customer Information
Age
Gender
Previous Orders
Previous Returns
First Order

### Product Information
Category
Price
Discount
Quantity
Product Rating
Customer Rating

### Order/Delivery Information
Delivery Time
Expected Delivery Time
Payment Method
Shipping Method
Region

Primary CTA:
**Predict Return Risk**

Result card:
- Prediction
- Probability
- Risk level
- Short explanation

Risk styling:
- Low → green
- Medium → amber
- High → red

Do not rely on color alone; also display text.

## 9. Cards
Use:
- White surface
- 1px subtle border
- Small radius
- Light shadow
- Consistent padding

Avoid excessive rounded/pill styling.

## 10. Buttons
Primary button:
- Blue
- White text
- Clear hover state

Secondary:
- White/light background
- Border
- Dark text

Danger actions are unnecessary for the core project.

## 11. Tables
Dataset preview:
- Compact
- Sticky header where useful
- Horizontal scrolling on smaller screens
- Clear column names

Do not display hundreds of rows by default.

## 12. States
Implement:
- Loading state
- Empty state
- Error state
- Success state

Example error:
"Unable to load model metrics. Please verify that the backend and trained model are available."

Do not expose raw stack traces to users.

## 13. Accessibility
- Maintain readable contrast.
- Use labels for all form fields.
- Ensure keyboard navigation works.
- Do not communicate important information through color alone.
- Buttons must have meaningful labels.

## 14. Visual Restraint
Do NOT use:
- Neon colors
- Excessive gradients
- Excessive animations
- Glassmorphism everywhere
- Giant hero sections
- Unnecessary 3D graphics
- Fake AI/chatbot elements

The focus is predictive analytics.
