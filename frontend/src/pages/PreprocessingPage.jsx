import React from 'react';
import { Sliders, ShieldCheck, Cpu, ArrowDown, CheckCircle, FileCode } from 'lucide-react';

export default function PreprocessingPage() {
  const steps = [
    {
      num: '01',
      title: 'Data Hygiene & De-duplication',
      desc: 'Removes duplicate orders from the raw stream and isolates unique transactional keys. Order_ID is excluded from feature sets to prevent spurious memorization.',
      tech: 'df.drop_duplicates()',
      tag: 'Integrity'
    },
    {
      num: '02',
      title: 'Domain Feature Engineering',
      desc: 'Creates higher-order behavioral interactions before statistical normalization. Computes Delivery_Delay, Previous_Return_Rate, Effective_Price, and Total_Order_Value.',
      tech: 'Custom Transformer (ECommerceFeatureEngineer)',
      tag: 'Feature Creation'
    },
    {
      num: '03',
      title: 'Imputation of Missing Observations',
      desc: 'Numerical missing values (e.g. Delivery_Time, Customer_Rating) are imputed using training medians. Categorical missing values are filled with the most frequent modal category.',
      tech: 'SimpleImputer(strategy="median" / "most_frequent")',
      tag: 'Missing Data'
    },
    {
      num: '04',
      title: 'Standardization (Feature Scaling)',
      desc: 'Continuous features are normalized to zero mean and unit variance: z = (x - μ) / σ. This ensures regularized Logistic Regression penalizes coefficients evenly.',
      tech: 'StandardScaler()',
      tag: 'Scaling'
    },
    {
      num: '05',
      title: 'Categorical One-Hot Encoding',
      desc: 'Non-ordinal categorical variables (Category, Region, Payment, Shipping) are expanded into dummy indicator vectors with handle_unknown="ignore".',
      tech: 'OneHotEncoder(handle_unknown="ignore", sparse_output=False)',
      tag: 'Encoding'
    },
    {
      num: '06',
      title: 'Pipeline Encapsulation & Leakage Prevention',
      desc: 'All transformers are wrapped into a single scikit-learn Pipeline alongside Logistic Regression. Fitted strictly on X_train; identical transformations execute on inference.',
      tech: 'sklearn.compose.ColumnTransformer & Pipeline',
      tag: 'Zero Leakage'
    }
  ];

  const engineeredFeatures = [
    {
      name: 'Delivery_Delay',
      formula: 'Delivery_Time - Expected_Delivery_Time',
      rationale: 'Negative values signify early delivery; positive values quantify consumer frustration due to delayed arrival.'
    },
    {
      name: 'Previous_Return_Rate',
      formula: 'Previous_Returns / (Previous_Orders + 1.0)',
      rationale: 'Smooths the habitual return probability for repeat customers while gracefully handling first-time buyers via Laplace smoothing (+1).'
    },
    {
      name: 'Effective_Price',
      formula: 'Product_Price × (1.0 - Discount_Percentage / 100.0)',
      rationale: 'Reflects the actual monetary commitment made by the consumer rather than the arbitrary list price.'
    },
    {
      name: 'Total_Order_Value',
      formula: 'Effective_Price × Quantity',
      rationale: 'Captures the total transaction exposure and perceived risk per order.'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Preprocessing & Feature Engineering</h1>
        <p className="page-description">
          The rigorous transformation pipeline that converts raw transactional logs into normalized, machine-learning-ready feature tensors with strict zero-leakage guarantees.
        </p>
      </div>

      {/* Critical Concept Alert: Zero Leakage */}
      <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--success-green)', background: 'var(--success-green-light)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <ShieldCheck size={28} style={{ color: 'var(--success-green)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Academic Integrity: Zero Data Leakage Guarantee
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Data leakage occurs when information from outside the training dataset is used to create the model. If imputers or scalers compute means or medians across the entire dataset prior to splitting, the model inadvertently gains advance knowledge of the test set distribution. In our implementation, <strong>Train-Test Split occurs BEFORE any preprocessing</strong>, and all transformation parameters are learned exclusively on <code>X_train</code> via a unified <code>Pipeline</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid-3">
        {steps.map((s) => (
          <div key={s.num} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{s.num}</span>
                <span className="badge badge-neutral">{s.tag}</span>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                {s.desc}
              </p>
            </div>
            <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-main)' }}>
              {s.tech}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Engineering Details */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title">
          <span>Engineered Interaction Features</span>
          <span className="badge badge-low">
            <CheckCircle size={14} /> Domain Specific
          </span>
        </div>
        <div className="card-subtitle">
          Mathematical definitions of synthesized features derived from raw e-commerce signals
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Mathematical Formula</th>
                <th>Predictive Rationale & Viva Explanation</th>
              </tr>
            </thead>
            <tbody>
              {engineeredFeatures.map((feat) => (
                <tr key={feat.name}>
                  <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--primary-blue)' }}>
                    {feat.name}
                  </td>
                  <td style={{ fontFamily: 'monospace', background: 'var(--bg-surface-subtle)' }}>
                    {feat.formula}
                  </td>
                  <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    {feat.rationale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Architecture Demonstration */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title">
          <span>Scikit-Learn Preprocessing Architecture</span>
          <span className="badge badge-neutral">backend/ml/preprocessing.py</span>
        </div>
        <div className="card-subtitle">Verified modular pipeline instantiation</div>

        <pre style={{
          background: '#0F172A',
          color: '#E2E8F0',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          overflowX: 'auto',
          lineHeight: 1.5
        }}>
{`# Unified Zero-Leakage Pipeline Architecture
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

num_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

cat_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])

col_transformer = ColumnTransformer([
    ("num", num_pipeline, ALL_NUMERICAL_FEATURES),
    ("cat", cat_pipeline, CATEGORICAL_FEATURES)
])

full_pipeline = Pipeline([
    ("feature_engineer", ECommerceFeatureEngineer()),
    ("col_transformer", col_transformer),
    ("classifier", LogisticRegression(C=0.05, max_iter=1000, random_state=42))
])`}
        </pre>
      </div>
    </div>
  );
}
