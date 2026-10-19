import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  RotateCcw, 
  Percent, 
  Award, 
  Target, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import KPICard from '../components/KPICard';
import { LoadingSpinner, ErrorAlert } from '../components/StatusComponents';
import { api } from '../services/api';

const COLORS = ['#2563EB', '#DC2626'];

export default function DashboardPage({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [eda, setEda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumRes, edaRes] = await Promise.all([
        api.getSummary(),
        api.getEda()
      ]);
      setSummary(sumRes);
      setEda(edaRes);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating dashboard statistics from dataset..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  const distData = eda?.return_distribution?.data || [];
  const catData = eda?.category_returns?.data || [];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Executive Analytics Dashboard</h1>
          <p className="page-description">
            Real-time e-commerce return probability monitoring, model performance indicators, and core risk drivers.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => onNavigate('prediction')}
        >
          <span>Live Risk Predictor</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard 
          label="Total Orders" 
          value={summary?.total_orders?.toLocaleString() || '0'} 
          subtext="E-commerce dataset records"
          icon={ShoppingBag} 
          color="navy"
        />
        <KPICard 
          label="Returned Orders" 
          value={summary?.total_returned?.toLocaleString() || '0'} 
          subtext="Target positive class (1)"
          icon={RotateCcw} 
          color="red"
        />
        <KPICard 
          label="Return Rate" 
          value={`${summary?.return_rate_percent || 0}%`} 
          subtext="Empirical baseline return frequency"
          icon={Percent} 
          color="amber"
        />
        <KPICard 
          label="Model Accuracy" 
          value={`${((summary?.test_accuracy || 0) * 100).toFixed(1)}%`} 
          subtext="Evaluated on 20% test split"
          icon={Award} 
          color="green"
        />
        <KPICard 
          label="Test F1-Score" 
          value={(summary?.test_f1 || 0).toFixed(3)} 
          subtext="Precision/Recall balance"
          icon={Target} 
          color="blue"
        />
        <KPICard 
          label="ROC-AUC Score" 
          value={(summary?.test_roc_auc || 0).toFixed(3)} 
          subtext="Discriminative power (0.5 = random)"
          icon={TrendingUp} 
          color="blue"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid-2">
        {/* Return Distribution */}
        <div className="card">
          <div className="card-title">
            <span>Class Balance: Return vs Retained</span>
            <span className="badge badge-neutral">Ground Truth</span>
          </div>
          <div className="card-subtitle">Distribution of returned vs retained orders across the dataset</div>
          
          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={distData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percentage }) => `${name.split(' ')[0]} ${percentage}%`}
                >
                  {distData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Key Observation:</strong> {eda?.return_distribution?.interpretation}
          </div>
        </div>

        {/* Category Return Rate */}
        <div className="card">
          <div className="card-title">
            <span>Return Rate by Product Category</span>
            <span className="badge badge-neutral">Empirical</span>
          </div>
          <div className="card-subtitle">Percentage of purchases returned per merchandise department</div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={catData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" unit="%" domain={[0, 50]} stroke="#64748B" />
                <YAxis dataKey="Product_Category" type="category" width={110} stroke="#64748B" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Return Rate']} />
                <Bar dataKey="return_rate_percent" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Key Observation:</strong> {eda?.category_returns?.interpretation}
          </div>
        </div>
      </div>

      {/* Predictive Drivers & Architecture */}
      <div className="grid-2">
        {/* Top Influential Factors */}
        <div className="card">
          <div className="card-title">
            <span>Primary Predictive Drivers</span>
            <span className="badge badge-neutral">Logistic Regression</span>
          </div>
          <div className="card-subtitle">Features exhibiting the highest standardized log-odds magnitude</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(summary?.top_features || []).map((feat, idx) => {
              const isPositive = feat.coefficient > 0;
              return (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isPositive ? 'var(--danger-red-light)' : 'var(--success-green-light)',
                      color: isPositive ? 'var(--danger-red)' : 'var(--success-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{feat.feature}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Odds Ratio: {feat.odds_ratio}x • {feat.direction}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${isPositive ? 'badge-high' : 'badge-low'}`}>
                    {feat.coefficient > 0 ? `+${feat.coefficient}` : feat.coefficient}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem' }}
              onClick={() => onNavigate('training')}
            >
              View Full Model Coefficients
            </button>
          </div>
        </div>

        {/* Workflow Overview Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">
              <span>Predictive Analytics Workflow</span>
              <span className="badge badge-neutral">Syllabus Pipeline</span>
            </div>
            <div className="card-subtitle">End-to-end execution methodology from raw data to inference</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {[
                { step: '1', title: 'Data Cleaning & Deduplication', desc: 'Duplicate rows eliminated, 1-2% missing entries identified for imputation.' },
                { step: '2', title: 'Feature Engineering', desc: 'Engineered Delivery Delay, Previous Return Ratio, and Effective Price.' },
                { step: '3', title: 'Zero-Leakage Preprocessing', desc: 'ColumnTransformer with SimpleImputer, StandardScaler, and OneHotEncoder fit strictly on training set.' },
                { step: '4', title: 'Logistic Regression & Tuning', desc: '5-fold Stratified CV with GridSearchCV hyperparameter optimization.' },
                { step: '5', title: 'Evaluation & Inference', desc: 'Tested on unseen 20% holdout set, computing exact probabilities via Sigmoid.' }
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--primary-blue)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {s.step}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'var(--primary-blue-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
              Ready to test hypothetical orders?
            </span>
            <button 
              className="btn btn-primary" 
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              onClick={() => onNavigate('prediction')}
            >
              Open Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
