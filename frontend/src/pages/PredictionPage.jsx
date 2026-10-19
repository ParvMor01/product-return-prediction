import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

const PRESETS = {
  highRiskFashion: {
    name: 'High-Risk Fashion Order',
    desc: 'Apparel with delayed delivery, high discount, COD, low product rating',
    data: {
      Customer_Age: 26,
      Customer_Gender: 'Female',
      Product_Category: 'Apparel',
      Product_Price: 135.0,
      Discount_Percentage: 35,
      Quantity: 2,
      Previous_Orders: 6,
      Previous_Returns: 5,
      Customer_Rating: 3.2,
      Delivery_Time: 9,
      Expected_Delivery_Time: 3,
      Payment_Method: 'Cash on Delivery',
      Shipping_Method: 'Standard',
      Customer_Location: 'North',
      Product_Rating: 2.3,
      Is_First_Order: 'No'
    }
  },
  safeElectronics: {
    name: 'Low-Risk Books Purchase',
    desc: 'Highly-rated books, prepaid UPI, fast on-time delivery, zero return history',
    data: {
      Customer_Age: 42,
      Customer_Gender: 'Male',
      Product_Category: 'Books',
      Product_Price: 32.0,
      Discount_Percentage: 5,
      Quantity: 1,
      Previous_Orders: 14,
      Previous_Returns: 0,
      Customer_Rating: 4.8,
      Delivery_Time: 2,
      Expected_Delivery_Time: 3,
      Payment_Method: 'UPI',
      Shipping_Method: 'Express',
      Customer_Location: 'West',
      Product_Rating: 4.9,
      Is_First_Order: 'No'
    }
  },
  firstTimeDelayed: {
    name: 'First-Time Buyer (Delayed)',
    desc: 'New customer experiencing unexpected 4-day shipping delay',
    data: {
      Customer_Age: 31,
      Customer_Gender: 'Other',
      Product_Category: 'Footwear',
      Product_Price: 95.0,
      Discount_Percentage: 20,
      Quantity: 1,
      Previous_Orders: 0,
      Previous_Returns: 0,
      Customer_Rating: 4.0,
      Delivery_Time: 8,
      Expected_Delivery_Time: 4,
      Payment_Method: 'Debit Card',
      Shipping_Method: 'Standard',
      Customer_Location: 'South',
      Product_Rating: 3.4,
      Is_First_Order: 'Yes'
    }
  }
};

export default function PredictionPage() {
  const [formData, setFormData] = useState(PRESETS.highRiskFashion.data);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyPreset = (key) => {
    setFormData(PRESETS[key].data);
    setPredictionResult(null);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.predict(formData);
      setPredictionResult(res);
    } catch (err) {
      setError(err.message || 'Prediction failed. Check input values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Real-Time Return Risk Prediction</h1>
        <p className="page-description">
          Enter hypothetical or real customer and order information. The backend executes the identical fitted preprocessing pipeline and Logistic Regression model to compute exact return probabilities and risk drivers.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Zap size={18} style={{ color: 'var(--primary-blue)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quick Load Presets for Demonstration:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {Object.entries(PRESETS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              className="btn btn-secondary"
              onClick={() => handleApplyPreset(key)}
              style={{ fontSize: '0.825rem', padding: '0.5rem 0.85rem' }}
            >
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Prediction Form */}
        <form onSubmit={handlePredict} className="card">
          <div className="card-title">
            <span>Order Parameters</span>
            <span className="badge badge-neutral">Pipeline Input</span>
          </div>
          <div className="card-subtitle">Fill in all transactional attributes required by the preprocessor</div>

          {/* Group 1: Customer Profile */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              1. Customer Profile
            </h4>
            <div className="grid-2" style={{ gap: '0.75rem', marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Customer Age</label>
                <input 
                  type="number" 
                  min="18" 
                  max="100"
                  value={formData.Customer_Age}
                  onChange={(e) => handleChange('Customer_Age', parseInt(e.target.value) || 18)}
                  className="form-input" 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select 
                  value={formData.Customer_Gender} 
                  onChange={(e) => handleChange('Customer_Gender', e.target.value)}
                  className="form-select"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid-3" style={{ gap: '0.75rem', marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Previous Orders</label>
                <input 
                  type="number" 
                  min="0" 
                  value={formData.Previous_Orders}
                  onChange={(e) => handleChange('Previous_Orders', parseInt(e.target.value) || 0)}
                  className="form-input" 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Previous Returns</label>
                <input 
                  type="number" 
                  min="0" 
                  value={formData.Previous_Returns}
                  onChange={(e) => handleChange('Previous_Returns', parseInt(e.target.value) || 0)}
                  className="form-input" 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">First Order?</label>
                <select 
                  value={formData.Is_First_Order} 
                  onChange={(e) => handleChange('Is_First_Order', e.target.value)}
                  className="form-select"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '0.75rem', marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Customer Region</label>
                <select 
                  value={formData.Customer_Location} 
                  onChange={(e) => handleChange('Customer_Location', e.target.value)}
                  className="form-select"
                >
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="Central">Central</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Customer Rating (1-5)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="1.0" 
                  max="5.0"
                  value={formData.Customer_Rating}
                  onChange={(e) => handleChange('Customer_Rating', parseFloat(e.target.value) || 4.0)}
                  className="form-input" 
                />
              </div>
            </div>
          </div>

          {/* Group 2: Product Information */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              2. Product & Pricing
            </h4>
            <div className="grid-2" style={{ gap: '0.75rem', marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Product Category</label>
                <select 
                  value={formData.Product_Category} 
                  onChange={(e) => handleChange('Product_Category', e.target.value)}
                  className="form-select"
                >
                  <option value="Apparel">Apparel</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  <option value="Books">Books</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  min="1"
                  value={formData.Product_Price}
                  onChange={(e) => handleChange('Product_Price', parseFloat(e.target.value) || 10)}
                  className="form-input" 
                  required
                />
              </div>
            </div>

            <div className="grid-3" style={{ gap: '0.75rem', marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Discount %</label>
                <input 
                  type="number" 
                  min="0" 
                  max="90"
                  value={formData.Discount_Percentage}
                  onChange={(e) => handleChange('Discount_Percentage', parseFloat(e.target.value) || 0)}
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={formData.Quantity}
                  onChange={(e) => handleChange('Quantity', parseInt(e.target.value) || 1)}
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Product Rating (1-5)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="1.0" 
                  max="5.0"
                  value={formData.Product_Rating}
                  onChange={(e) => handleChange('Product_Rating', parseFloat(e.target.value) || 4.0)}
                  className="form-input" 
                />
              </div>
            </div>
          </div>

          {/* Group 3: Delivery & Payment */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              3. Delivery & Fulfillment
            </h4>
            <div className="grid-2" style={{ gap: '0.75rem', marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Actual Delivery Time (Days)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30"
                  value={formData.Delivery_Time}
                  onChange={(e) => handleChange('Delivery_Time', parseInt(e.target.value) || 1)}
                  className="form-input" 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Delivery Time (Days)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30"
                  value={formData.Expected_Delivery_Time}
                  onChange={(e) => handleChange('Expected_Delivery_Time', parseInt(e.target.value) || 1)}
                  className="form-input" 
                  required
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '0.75rem', marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Shipping Method</label>
                <select 
                  value={formData.Shipping_Method} 
                  onChange={(e) => handleChange('Shipping_Method', e.target.value)}
                  className="form-select"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Same Day">Same Day</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select 
                  value={formData.Payment_Method} 
                  onChange={(e) => handleChange('Payment_Method', e.target.value)}
                  className="form-select"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Computing Probability via Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>PREDICT RETURN RISK</span>
              </>
            )}
          </button>
        </form>

        {/* Prediction Results Display */}
        <div>
          {error && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="badge badge-high" style={{ padding: '0.75rem', width: '100%' }}>
                {error}
              </div>
            </div>
          )}

          {predictionResult ? (
            <div className="card" style={{ borderTop: `4px solid ${predictionResult.risk_level === 'High' ? 'var(--danger-red)' : predictionResult.risk_level === 'Medium' ? 'var(--warning-amber)' : 'var(--success-green)'}` }}>
              <div className="card-title">
                <span>Prediction Result</span>
                <span className={`badge ${predictionResult.risk_level === 'High' ? 'badge-high' : predictionResult.risk_level === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                  {predictionResult.risk_level} Risk Level
                </span>
              </div>
              <div className="card-subtitle">Calculated by fitted Logistic Regression model using sigmoid activation</div>

              {/* Main Classification Callout */}
              <div style={{
                textAlign: 'center',
                padding: '1.75rem 1rem',
                margin: '1rem 0',
                borderRadius: 'var(--radius-lg)',
                background: predictionResult.risk_level === 'High' ? 'var(--danger-red-light)' : predictionResult.risk_level === 'Medium' ? 'var(--warning-amber-light)' : 'var(--success-green-light)',
                border: `1px solid ${predictionResult.risk_level === 'High' ? 'rgba(220, 38, 38, 0.2)' : predictionResult.risk_level === 'Medium' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(22, 163, 74, 0.2)'}`
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: predictionResult.risk_level === 'High' ? 'var(--danger-red)' : predictionResult.risk_level === 'Medium' ? 'var(--warning-amber)' : 'var(--success-green)' }}>
                  CLASSIFICATION OUTCOME
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-navy)', margin: '0.35rem 0' }}>
                  {predictionResult.label.toUpperCase()}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Confidence Threshold: p(y=1) ≥ 0.50
                </div>
              </div>

              {/* Probability Meter */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Return Probability: {predictionResult.return_probability_percent}%</span>
                  <span>Retain Probability: {(predictionResult.no_return_probability * 100).toFixed(1)}%</span>
                </div>
                <div style={{ height: 12, background: 'var(--bg-surface-subtle)', borderRadius: 9999, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ 
                    width: `${predictionResult.return_probability_percent}%`, 
                    backgroundColor: predictionResult.risk_level === 'High' ? 'var(--danger-red)' : predictionResult.risk_level === 'Medium' ? 'var(--warning-amber)' : 'var(--success-green)',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>

              {/* Individual Prediction Factors Explanation */}
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={16} />
                  <span>Why this prediction? Key Input Factors:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(predictionResult.top_factors || []).map((factor, i) => (
                    <div 
                      key={i}
                      style={{
                        padding: '0.6rem 0.85rem',
                        background: 'var(--bg-surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.825rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {factor.is_risk_increasing ? (
                          <ArrowUpRight size={16} style={{ color: 'var(--danger-red)' }} />
                        ) : (
                          <ArrowDownRight size={16} style={{ color: 'var(--success-green)' }} />
                        )}
                        <span style={{ fontWeight: 600 }}>{factor.feature}</span>
                      </div>
                      <span className={`badge ${factor.is_risk_increasing ? 'badge-high' : 'badge-low'}`}>
                        {factor.is_risk_increasing ? `+${factor.contribution}` : factor.contribution} log-odds
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-interpretation" style={{ marginTop: '1.25rem', fontSize: '0.775rem' }}>
                <strong>Academic Distinction:</strong> These feature contributions represent model-based statistical log-odds additions ($\beta_j x_j^*$) and describe correlation within the trained sample, not absolute causation.
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-secondary)' }}>
              <Sparkles size={36} style={{ color: 'var(--primary-blue)', margin: '0 auto 0.75rem auto' }} />
              <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
                Awaiting Order Details
              </div>
              <p style={{ fontSize: '0.85rem', maxWidth: 360, margin: '0 auto' }}>
                Configure the order attributes on the left or select a preset, then click <strong>PREDICT RETURN RISK</strong> to see the model evaluation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
