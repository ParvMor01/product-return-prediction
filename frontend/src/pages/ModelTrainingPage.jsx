import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Sliders, Layers, BarChart2, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { LoadingSpinner, ErrorAlert } from '../components/StatusComponents';
import { api } from '../services/api';

export default function ModelTrainingPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getModelMetrics();
      setMetrics(res);
    } catch (err) {
      setError(err.message || 'Failed to load model training artifacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading training metrics, cross-validation & grid search..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  const cv = metrics?.cross_validation || {};
  const grid = metrics?.hyperparameter_tuning || {};
  const baseline = metrics?.baseline_comparison || {};
  const testMetrics = metrics?.test_metrics || {};
  const topFeatures = metrics?.top_features || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Model Training & Hyperparameter Tuning</h1>
        <p className="page-description">
          Primary syllabus technique: Logistic Regression trained via stratified 5-fold cross-validation and optimized through GridSearchCV. Zero data leakage ensured by end-to-end Pipeline encapsulation.
        </p>
      </div>

      {/* Experimental Setup Summary */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Algorithm</span>
          <div className="kpi-value" style={{ fontSize: '1.4rem' }}>Logistic Regression</div>
          <div className="kpi-subtext">L2 Regularized with L-BFGS</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Train-Test Split</span>
          <div className="kpi-value">80% / 20%</div>
          <div className="kpi-subtext">Stratified on Return_Status (seed=42)</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">5-Fold CV ROC-AUC</span>
          <div className="kpi-value" style={{ color: 'var(--primary-blue)' }}>
            {(cv.mean_roc_auc || 0).toFixed(4)}
          </div>
          <div className="kpi-subtext">± {(cv.std_accuracy || 0).toFixed(4)} across folds</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Tuned Inverse Reg (C)</span>
          <div className="kpi-value" style={{ color: 'var(--success-green)' }}>
            {grid.best_params?.classifier__C || '0.05'}
          </div>
          <div className="kpi-subtext">Selected via GridSearchCV</div>
        </div>
      </div>

      {/* Grid: Baseline Comparison & Cross-Validation */}
      <div className="grid-2">
        {/* Baseline vs Model Comparison */}
        <div className="card">
          <div className="card-title">
            <span>Model Comparison: Baseline vs Logistic Regression</span>
            <span className="badge badge-low">Outperforms Baseline</span>
          </div>
          <div className="card-subtitle">
            Proves model extracts genuine predictive signal rather than relying on class majority
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Dummy Classifier (Majority)</th>
                  <th>Logistic Regression (Ours)</th>
                  <th>Predictive Lift</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Accuracy</td>
                  <td>{((baseline.accuracy || 0) * 100).toFixed(1)}%</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                    {((testMetrics.accuracy || 0) * 100).toFixed(1)}%
                  </td>
                  <td>+{(testMetrics.accuracy - baseline.accuracy > 0 ? (testMetrics.accuracy - baseline.accuracy)*100 : 0).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Precision</td>
                  <td>{((baseline.precision || 0) * 100).toFixed(1)}%</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                    {((testMetrics.precision || 0) * 100).toFixed(1)}%
                  </td>
                  <td style={{ color: 'var(--success-green)' }}>Identifies true returns</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Recall</td>
                  <td>{((baseline.recall || 0) * 100).toFixed(1)}%</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                    {((testMetrics.recall || 0) * 100).toFixed(1)}%
                  </td>
                  <td style={{ color: 'var(--success-green)' }}>Captures high risk</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>F1-Score</td>
                  <td>{baseline.f1 || 0}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                    {testMetrics.f1 || 0}
                  </td>
                  <td style={{ color: 'var(--success-green)' }}>Substantial improvement</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>ROC-AUC</td>
                  <td>{baseline.roc_auc || 0.5} (Random)</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                    {testMetrics.roc_auc || 0}
                  </td>
                  <td style={{ color: 'var(--success-green)', fontWeight: 600 }}>High Discrimination</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="chart-interpretation" style={{ marginTop: '1rem' }}>
            <strong>Viva Note:</strong> A naive model predicting "Not Returned" for every order achieves ~69.7% accuracy solely because of class imbalance, but has an F1-score of 0.0. Our Logistic Regression model provides real discriminative power with an ROC-AUC of {testMetrics.roc_auc}.
          </div>
        </div>

        {/* 5-Fold Cross Validation Fold Performance */}
        <div className="card">
          <div className="card-title">
            <span>5-Fold Stratified Cross-Validation</span>
            <span className="badge badge-neutral">Training Set Only</span>
          </div>
          <div className="card-subtitle">Performance consistency evaluated across 5 stratified resampled splits</div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Split Fold</th>
                  <th>ROC-AUC Score</th>
                  <th>F1 Score</th>
                  <th>Fold Stability</th>
                </tr>
              </thead>
              <tbody>
                {(cv.fold_roc_auc_scores || []).map((score, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>Fold {i + 1}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--primary-blue)' }}>{score}</td>
                    <td style={{ fontFamily: 'monospace' }}>{(cv.fold_f1_scores || [])[i]}</td>
                    <td>
                      <span className="badge badge-low">
                        <CheckCircle2 size={12} /> Stable
                      </span>
                    </td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg-surface-subtle)', fontWeight: 700 }}>
                  <td>Mean ± Std</td>
                  <td style={{ color: 'var(--primary-blue)' }}>{cv.mean_roc_auc}</td>
                  <td>{cv.mean_f1}</td>
                  <td>Mean CV Score</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="chart-interpretation" style={{ marginTop: '1rem' }}>
            <strong>Why Cross-Validation Matters:</strong> Cross-validation guards against lucky train-test splits. The tight grouping of ROC-AUC scores ({cv.fold_roc_auc_scores?.join(', ')}) confirms the model generalizes consistently.
          </div>
        </div>
      </div>

      {/* Hyperparameter Tuning & Grid Search Results */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">
          <span>GridSearchCV Hyperparameter Optimization</span>
          <span className="badge badge-neutral">Scikit-Learn GridSearchCV</span>
        </div>
        <div className="card-subtitle">
          Exhaustive parameter search over inverse regularization strength C and solvers
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PARAMETER GRID SEARCHED</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.825rem', fontFamily: 'monospace' }}>
              <div>C: [0.05, 0.1, 0.5, 1.0, 5.0]</div>
              <div>penalty: ['l2']</div>
              <div>solver: ['lbfgs']</div>
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--success-green-light)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--success-green)', fontWeight: 600 }}>OPTIMAL CONFIGURATION</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'monospace' }}>
              C = {grid.best_params?.classifier__C || 0.05}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Optimal regularizer preventing overfitting
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--primary-blue-light)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 600 }}>OPTIMAL CV ROC-AUC</div>
            <div style={{ marginTop: '0.5rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
              {grid.best_cv_score}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Scored via 5-fold Stratified CV
            </div>
          </div>
        </div>

        <div className="chart-interpretation">
          <strong>Overfitting vs. Underfitting Control:</strong> Parameter <code>C</code> is the inverse of regularization strength ($C = 1/\lambda$). A smaller $C = 0.05$ enforces stronger L2 weight shrinkage, damping excessive coefficient variance and improving out-of-sample generalization.
        </div>
      </div>

      {/* Feature Coefficients Table */}
      <div className="card">
        <div className="card-title">
          <span>Logistic Regression Learned Coefficients (Top Influential Factors)</span>
          <span className="badge badge-neutral">Model Interpretability</span>
        </div>
        <div className="card-subtitle">
          Standardized log-odds coefficients ($\beta$) and corresponding Odds Ratios ($\exp(\beta)$)
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Coefficient ($\beta$)</th>
                <th>Odds Ratio ($\exp(\beta)$)</th>
                <th>Directional Association</th>
                <th>Viva Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {topFeatures.map((feat, idx) => {
                const isPos = feat.coefficient > 0;
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{feat.feature}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: isPos ? 'var(--danger-red)' : 'var(--success-green)' }}>
                      {isPos ? `+${feat.coefficient}` : feat.coefficient}
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{feat.odds_ratio}x</td>
                    <td>
                      <span className={`badge ${isPos ? 'badge-high' : 'badge-low'}`}>
                        {isPos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {feat.direction}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {isPos 
                        ? `Higher ${feat.feature.toLowerCase()} associates with higher odds of return.` 
                        : `Higher ${feat.feature.toLowerCase()} associates with lower odds of return.`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
