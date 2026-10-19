import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Target, Award, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import KPICard from '../components/KPICard';
import { LoadingSpinner, ErrorAlert } from '../components/StatusComponents';
import { api } from '../services/api';

export default function EvaluationPage() {
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
      setError(err.message || 'Failed to load evaluation metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Evaluating model performance on holdout test set..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  const test = metrics?.test_metrics || {};
  const cm = metrics?.confusion_matrix || { tn: 0, fp: 0, fn: 0, tp: 0 };
  const rocPoints = metrics?.roc_curve || [];
  const prPoints = metrics?.pr_curve || [];

  const totalTest = cm.tn + cm.fp + cm.fn + cm.tp;
  const tnPct = totalTest ? ((cm.tn / totalTest) * 100).toFixed(1) : 0;
  const fpPct = totalTest ? ((cm.fp / totalTest) * 100).toFixed(1) : 0;
  const fnPct = totalTest ? ((cm.fn / totalTest) * 100).toFixed(1) : 0;
  const tpPct = totalTest ? ((cm.tp / totalTest) * 100).toFixed(1) : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Holdout Test Evaluation & Error Analysis</h1>
        <p className="page-description">
          Rigorous out-of-sample evaluation performed on the untouched 20% stratified test split (N = {totalTest} orders). Complete breakdown of classification metrics, confusion matrix cells, and ROC curves.
        </p>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid">
        <KPICard 
          label="Accuracy" 
          value={`${((test.accuracy || 0) * 100).toFixed(1)}%`} 
          subtext="(TN + TP) / Total"
          icon={Award} 
          color="navy"
        />
        <KPICard 
          label="Precision" 
          value={`${((test.precision || 0) * 100).toFixed(1)}%`} 
          subtext="TP / (TP + FP) Predicted Returns"
          icon={Target} 
          color="blue"
        />
        <KPICard 
          label="Recall (Sensitivity)" 
          value={`${((test.recall || 0) * 100).toFixed(1)}%`} 
          subtext="TP / (TP + FN) Actual Returns"
          icon={Target} 
          color="amber"
        />
        <KPICard 
          label="F1-Score" 
          value={(test.f1 || 0).toFixed(3)} 
          subtext="Harmonic Mean of Precision & Recall"
          icon={Target} 
          color="green"
        />
        <KPICard 
          label="ROC-AUC" 
          value={(test.roc_auc || 0).toFixed(3)} 
          subtext="Rank-order discrimination capability"
          icon={Target} 
          color="blue"
        />
      </div>

      {/* Metric Definitions & Viva Guide */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">
          <span>Metric Explanations (Prepared for Viva Voce)</span>
          <span className="badge badge-low">
            <CheckCircle2 size={14} /> Evaluation Theory
          </span>
        </div>
        <div className="card-subtitle">Why accuracy alone is inadequate for e-commerce return prediction</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>Precision</div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <em>"Of all orders the model flagged as high risk returns, what fraction was truly returned?"</em> High precision ensures the merchant does not unnecessarily withhold discounts or bother safe customers.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>Recall (Sensitivity)</div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <em>"Of all items actually returned by customers, what fraction was successfully captured by our model?"</em> High recall minimizes undetected costly reverse logistics.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>F1-Score</div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              The harmonic mean between Precision and Recall: <code>2 · (P · R) / (P + R)</code>. Penalizes extreme imbalances between false positives and false negatives.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>ROC-AUC</div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Evaluates the model's ability to rank a randomly chosen returned order higher than a retained order across all classification thresholds, independent of decision cutoffs.
            </p>
          </div>
        </div>
      </div>

      {/* Confusion Matrix and ROC Curve */}
      <div className="grid-2">
        {/* Confusion Matrix Card */}
        <div className="card">
          <div className="card-title">
            <span>Confusion Matrix (N = {totalTest})</span>
            <span className="badge badge-neutral">Test Set Split</span>
          </div>
          <div className="card-subtitle">Actual Return Status vs Model Predictions (Threshold = 0.50)</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
            {/* True Negative */}
            <div style={{ padding: '1.25rem', background: 'var(--success-green-light)', border: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-green)' }}>TRUE NEGATIVE (TN)</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>{cm.tn}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tnPct}% of test orders</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--success-green)', marginTop: '0.25rem' }}>Retained order correctly predicted</div>
            </div>

            {/* False Positive */}
            <div style={{ padding: '1.25rem', background: 'var(--warning-amber-light)', border: '1px solid rgba(217, 119, 6, 0.2)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning-amber)' }}>FALSE POSITIVE (FP)</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>{cm.fp}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{fpPct}% of test orders</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--warning-amber)', marginTop: '0.25rem' }}>Type I Error: False Alarm</div>
            </div>

            {/* False Negative */}
            <div style={{ padding: '1.25rem', background: 'var(--danger-red-light)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger-red)' }}>FALSE NEGATIVE (FN)</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>{cm.fn}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{fnPct}% of test orders</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--danger-red)', marginTop: '0.25rem' }}>Type II Error: Missed Return</div>
            </div>

            {/* True Positive */}
            <div style={{ padding: '1.25rem', background: 'var(--primary-blue-light)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-blue)' }}>TRUE POSITIVE (TP)</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>{cm.tp}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tpPct}% of test orders</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary-blue)', marginTop: '0.25rem' }}>Returned order correctly predicted</div>
            </div>
          </div>

          <div className="chart-interpretation">
            <strong>Error Trade-off:</strong> In commercial e-commerce, Type II errors (False Negatives) carry tangible shipping and handling return expenses, while Type I errors (False Positives) might cause unnecessary customer outreach.
          </div>
        </div>

        {/* ROC Curve Chart */}
        <div className="card">
          <div className="card-title">
            <span>ROC Curve (Receiver Operating Characteristic)</span>
            <span className="badge badge-low">AUC = {test.roc_auc}</span>
          </div>
          <div className="card-subtitle">True Positive Rate vs. False Positive Rate across all decision cutoffs</div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={rocPoints} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="fpr" 
                  type="number" 
                  domain={[0, 1]} 
                  label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -10, fontSize: 12 }} 
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  dataKey="tpr" 
                  type="number" 
                  domain={[0, 1]} 
                  label={{ value: 'True Positive Rate (Recall)', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(val, name) => [val, name === 'tpr' ? 'TPR' : 'FPR']} />
                <Line type="monotone" dataKey="tpr" stroke="#2563EB" strokeWidth={2.5} dot={false} name="Logistic Regression" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> The blue curve arches well above the diagonal reference line ($y = x$), confirming that Logistic Regression has strong discriminative power across variable decision thresholds.
          </div>
        </div>
      </div>
    </div>
  );
}
