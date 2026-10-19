import React, { useEffect, useState } from 'react';
import { Database, Search, Filter, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { LoadingSpinner, ErrorAlert } from '../components/StatusComponents';
import { api } from '../services/api';

export default function DatasetPage() {
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDataset();
      setDatasetInfo(res);
    } catch (err) {
      setError(err.message || 'Failed to load dataset details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dataset overview & sample records..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  const filteredRecords = (datasetInfo?.preview_records || []).filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(row.Order_ID || '').toLowerCase().includes(term) ||
      String(row.Product_Category || '').toLowerCase().includes(term) ||
      String(row.Customer_Location || '').toLowerCase().includes(term) ||
      String(row.Payment_Method || '').toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dataset Overview & Data Hygiene</h1>
        <p className="page-description">
          Comprehensive exploration of dataset schema, feature modalities, target balance, missing-value audit, and deduplication verification.
        </p>
      </div>

      {/* Dataset Statistics Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Records</span>
          <div className="kpi-value">{datasetInfo?.total_records?.toLocaleString()}</div>
          <div className="kpi-subtext">Rows loaded from CSV</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Input Features</span>
          <div className="kpi-value">{datasetInfo?.total_features}</div>
          <div className="kpi-subtext">Excludes Order_ID & target</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Target Feature</span>
          <div className="kpi-value" style={{ fontSize: '1.4rem' }}>{datasetInfo?.target_variable}</div>
          <div className="kpi-subtext">0 = Retained, 1 = Returned</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Duplicates Removed</span>
          <div className="kpi-value" style={{ color: 'var(--success-green)' }}>
            {datasetInfo?.duplicates_removed || 0}
          </div>
          <div className="kpi-subtext">Exact duplicate rows eliminated</div>
        </div>
      </div>

      {/* Feature Modalities & Schema Breakdown */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <span>Numerical Features ({datasetInfo?.numerical_features?.length || 0})</span>
            <span className="badge badge-neutral">Continuous / Discrete</span>
          </div>
          <div className="card-subtitle">Features processed via SimpleImputer(median) and StandardScaler</div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(datasetInfo?.numerical_features || []).map((feat) => (
              <span key={feat} style={{
                background: 'var(--bg-surface-subtle)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                border: '1px solid var(--border-color)',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {feat}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'var(--primary-blue-light)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--primary-blue)' }}>
            <strong>Scaling Note:</strong> StandardScaler scales features to zero mean and unit variance ($z = (x - \mu)/\sigma$). This ensures coefficients in Logistic Regression represent comparable standardized effects.
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Categorical Features ({datasetInfo?.categorical_features?.length || 0})</span>
            <span className="badge badge-neutral">Nominal</span>
          </div>
          <div className="card-subtitle">Features processed via SimpleImputer(mode) and OneHotEncoder</div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(datasetInfo?.categorical_features || []).map((feat) => (
              <span key={feat} style={{
                background: 'var(--bg-surface-subtle)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                border: '1px solid var(--border-color)',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {feat}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'var(--success-green-light)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--success-green)' }}>
            <strong>Encoding Strategy:</strong> One-hot encoding creates binary indicator columns for each category level, with <code>handle_unknown='ignore'</code> to ensure inference resilience against novel values.
          </div>
        </div>
      </div>

      {/* Missing Values Audit */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">
          <span>Missing Values Audit (Before vs. After Cleaning)</span>
          <span className="badge badge-low">
            <ShieldCheck size={14} /> Zero Leakage Imputation
          </span>
        </div>
        <div className="card-subtitle">
          Inspection of null entries in raw data and how the Pipeline handles them without lookahead bias
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Data Type</th>
                <th>Null Count (Raw)</th>
                <th>Null % (Raw)</th>
                <th>Imputation Strategy</th>
                <th>Status in Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(datasetInfo?.missing_values_before || {}).map(([col, rawNulls]) => {
                const total = datasetInfo?.total_records || 3500;
                const pct = ((rawNulls / total) * 100).toFixed(1);
                const isNum = (datasetInfo?.numerical_features || []).includes(col);
                const isCat = (datasetInfo?.categorical_features || []).includes(col);
                
                let strategy = 'None required';
                if (rawNulls > 0) {
                  strategy = isNum ? 'SimpleImputer(strategy="median")' : 'SimpleImputer(strategy="most_frequent")';
                }

                return (
                  <tr key={col}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{col}</td>
                    <td>{isNum ? 'Numerical' : isCat ? 'Categorical' : 'Identifier / Target'}</td>
                    <td style={{ color: rawNulls > 0 ? 'var(--warning-amber)' : 'var(--text-secondary)' }}>
                      {rawNulls}
                    </td>
                    <td>{pct}%</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{strategy}</span>
                    </td>
                    <td>
                      <span className="badge badge-low">
                        <CheckCircle2 size={12} /> Resolved in Pipeline
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Sample Records Preview */}
      <div className="card">
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span>Dataset Preview (First 20 Observations)</span>
            <div className="card-subtitle" style={{ marginBottom: 0 }}>Examine representative records across customer, product, and delivery attributes</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text"
              placeholder="Search category, location, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ width: 240, padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        <div className="table-responsive" style={{ marginTop: '1rem', maxHeight: 420 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Qty</th>
                <th>Prev Orders</th>
                <th>Prev Returns</th>
                <th>Delivery Time</th>
                <th>Expected Time</th>
                <th>Payment</th>
                <th>Region</th>
                <th>Product Rating</th>
                <th>Return Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((row, idx) => {
                const isReturned = row.Return_Status === 1;
                return (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.Order_ID}</td>
                    <td>{row.Customer_Age}</td>
                    <td>{row.Customer_Gender}</td>
                    <td>
                      <span className="badge badge-neutral">{row.Product_Category}</span>
                    </td>
                    <td>${Number(row.Product_Price).toFixed(2)}</td>
                    <td>{row.Discount_Percentage}%</td>
                    <td>{row.Quantity}</td>
                    <td>{row.Previous_Orders}</td>
                    <td>{row.Previous_Returns}</td>
                    <td>{row.Delivery_Time} d</td>
                    <td>{row.Expected_Delivery_Time} d</td>
                    <td>{row.Payment_Method}</td>
                    <td>{row.Customer_Location}</td>
                    <td>⭐ {row.Product_Rating}</td>
                    <td>
                      <span className={`badge ${isReturned ? 'badge-high' : 'badge-low'}`}>
                        {isReturned ? 'Returned (1)' : 'Retained (0)'}
                      </span>
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
