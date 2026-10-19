import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  RefreshCw,
  Award,
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';
import { api } from './services/api';

const PRESETS = [
  {
    name: 'High Risk Order',
    desc: 'Apparel with 6-day delay, cash on delivery, low rating',
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
  {
    name: 'Low Risk Order',
    desc: 'Books with fast express delivery, prepaid UPI, high rating',
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
  {
    name: 'Moderate Risk (Delayed)',
    desc: 'Footwear with 4-day shipping delay',
    data: {
      Customer_Age: 30,
      Customer_Gender: 'Other',
      Product_Category: 'Footwear',
      Product_Price: 85.0,
      Discount_Percentage: 20,
      Quantity: 1,
      Previous_Orders: 2,
      Previous_Returns: 1,
      Customer_Rating: 4.0,
      Delivery_Time: 7,
      Expected_Delivery_Time: 3,
      Payment_Method: 'Debit Card',
      Shipping_Method: 'Standard',
      Customer_Location: 'South',
      Product_Rating: 3.5,
      Is_First_Order: 'No'
    }
  }
];

export default function App() {
  const [formData, setFormData] = useState(PRESETS[0].data);
  const [prediction, setPrediction] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHealthy, setIsHealthy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check health and load summary metrics
    const loadInitialData = async () => {
      try {
        const [healthRes, summaryRes] = await Promise.all([
          api.getHealth(),
          api.getSummary()
        ]);
        setIsHealthy(healthRes.status === 'healthy' && healthRes.model_loaded);
        setSummary(summaryRes);
      } catch (err) {
        console.error('Failed to connect to backend:', err);
      }
    };
    loadInitialData();

    // Run an initial prediction with default preset
    handlePredictInternal(PRESETS[0].data);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyPreset = (presetData) => {
    setFormData(presetData);
    handlePredictInternal(presetData);
  };

  const handlePredictInternal = async (inputData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.predict(inputData);
      setPrediction(res);
    } catch (err) {
      setError(err.message || 'Prediction failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePredictInternal(formData);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                Product Return Prediction
              </h1>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Predictive Machine Learning Model (Logistic Regression)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Single Page Content */}
      <main style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        {/* 1-Click Quick Presets at the Very Top */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} style={{ color: '#2563EB' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>Quick Demo Presets:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p.data)}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  color: '#1E293B',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Form & Result Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Order Details Input Form */}
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
              Order Attributes
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Enter customer and shipping attributes to calculate return probability.
            </p>

            {/* Section 1: Customer */}
            <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                1. Customer Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Age</label>
                  <input 
                    type="number" 
                    min="18" 
                    max="100" 
                    value={formData.Customer_Age}
                    onChange={(e) => handleChange('Customer_Age', parseInt(e.target.value) || 18)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Gender</label>
                  <select 
                    value={formData.Customer_Gender} 
                    onChange={(e) => handleChange('Customer_Gender', e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Past Orders</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formData.Previous_Orders}
                    onChange={(e) => handleChange('Previous_Orders', parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Past Returns</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formData.Previous_Returns}
                    onChange={(e) => handleChange('Previous_Returns', parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>First Order?</label>
                  <select 
                    value={formData.Is_First_Order} 
                    onChange={(e) => handleChange('Is_First_Order', e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Product & Pricing */}
            <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                2. Product Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
                  <select 
                    value={formData.Product_Category} 
                    onChange={(e) => handleChange('Product_Category', e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Books">Books</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Price ($)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="1" 
                    value={formData.Product_Price}
                    onChange={(e) => handleChange('Product_Price', parseFloat(e.target.value) || 1)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Discount %</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="90" 
                    value={formData.Discount_Percentage}
                    onChange={(e) => handleChange('Discount_Percentage', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={formData.Quantity}
                    onChange={(e) => handleChange('Quantity', parseInt(e.target.value) || 1)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Rating (1-5)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="1.0" 
                    max="5.0" 
                    value={formData.Product_Rating}
                    onChange={(e) => handleChange('Product_Rating', parseFloat(e.target.value) || 4.0)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Delivery & Payment */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                3. Delivery & Payment
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Actual Days</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="30" 
                    value={formData.Delivery_Time}
                    onChange={(e) => handleChange('Delivery_Time', parseInt(e.target.value) || 1)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Expected Days</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="30" 
                    value={formData.Expected_Delivery_Time}
                    onChange={(e) => handleChange('Expected_Delivery_Time', parseInt(e.target.value) || 1)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Payment</label>
                  <select 
                    value={formData.Payment_Method} 
                    onChange={(e) => handleChange('Payment_Method', e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Region</label>
                  <select 
                    value={formData.Customer_Location} 
                    onChange={(e) => handleChange('Customer_Location', e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: '0.85rem' }}
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Calculating Model Risk...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>CALCULATE RETURN RISK</span>
                </>
              )}
            </button>
          </form>

          {/* Result Card Column */}
          <div>
            {error && (
              <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {prediction ? (
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Calculated Risk Result</h3>
                  <span style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 9999,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: prediction.risk_level === 'High' ? '#FEF2F2' : prediction.risk_level === 'Medium' ? '#FFFBEB' : '#F0FDF4',
                    color: prediction.risk_level === 'High' ? '#DC2626' : prediction.risk_level === 'Medium' ? '#D97706' : '#16A34A',
                    border: `1px solid ${prediction.risk_level === 'High' ? '#FECACA' : prediction.risk_level === 'Medium' ? '#FDE68A' : '#BBF7D0'}`
                  }}>
                    {prediction.risk_level.toUpperCase()} RISK
                  </span>
                </div>

                {/* Primary Outcome Callout */}
                <div style={{
                  padding: '1.5rem 1rem',
                  borderRadius: 10,
                  textAlign: 'center',
                  backgroundColor: prediction.risk_level === 'High' ? '#FEF2F2' : prediction.risk_level === 'Medium' ? '#FFFBEB' : '#F0FDF4',
                  border: `1px solid ${prediction.risk_level === 'High' ? '#FECACA' : prediction.risk_level === 'Medium' ? '#FDE68A' : '#BBF7D0'}`,
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: prediction.risk_level === 'High' ? '#DC2626' : prediction.risk_level === 'Medium' ? '#D97706' : '#16A34A', marginBottom: '0.25rem' }}>
                    PREDICTED OUTCOME
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                    {prediction.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Classification Cutoff: p(return) ≥ 0.50
                  </div>
                </div>

                {/* Probability Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                    <span>Return Probability: {prediction.return_probability_percent}%</span>
                    <span>No Return: {(prediction.no_return_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 12, backgroundColor: '#E2E8F0', borderRadius: 9999, overflow: 'hidden', display: 'flex' }}>
                    <div style={{
                      width: `${prediction.return_probability_percent}%`,
                      backgroundColor: prediction.risk_level === 'High' ? '#DC2626' : prediction.risk_level === 'Medium' ? '#D97706' : '#16A34A',
                      transition: 'width 0.4s ease'
                    }}></div>
                  </div>
                </div>

                {/* Local Contributing Factors */}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <HelpCircle size={16} style={{ color: '#2563EB' }} />
                    <span>Why this prediction? Key Factors:</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(prediction.top_factors || []).map((factor, i) => (
                      <div 
                        key={i}
                        style={{
                          padding: '0.6rem 0.85rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: 6,
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.825rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {factor.is_risk_increasing ? (
                            <ArrowUpRight size={16} style={{ color: '#DC2626' }} />
                          ) : (
                            <ArrowDownRight size={16} style={{ color: '#16A34A' }} />
                          )}
                          <span style={{ fontWeight: 600, color: '#1E293B' }}>{factor.feature}</span>
                        </div>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: 4,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: factor.is_risk_increasing ? '#FEF2F2' : '#F0FDF4',
                          color: factor.is_risk_increasing ? '#DC2626' : '#16A34A',
                          border: `1px solid ${factor.is_risk_increasing ? '#FECACA' : '#BBF7D0'}`
                        }}>
                          {factor.is_risk_increasing ? `+${factor.contribution}` : factor.contribution}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanatory Note */}
                <div style={{ marginTop: '1.25rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: 6, borderLeft: '3px solid #2563EB', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
                  <strong>Model-Based Association:</strong> Probabilities are calculated through the fitted scikit-learn Logistic Regression sigmoid equation based on historical training patterns.
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* BOTTOM SECTION: Model Performance & Technical Indicators */}
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
            Model Performance & Learned Weights
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
            Academic summary of the underlying Logistic Regression model evaluated on the holdout test set:
          </p>

          {/* Metric Badges Row (Now at the bottom) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>ALGORITHM</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Logistic Regression</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>MODEL ACCURACY</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                  {summary?.test_accuracy ? `${(summary.test_accuracy * 100).toFixed(1)}%` : '70.3%'}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>ROC-AUC SCORE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                  {summary?.test_roc_auc ? summary.test_roc_auc.toFixed(3) : '0.668'}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#F8FAFC', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>TRAINED RECORDS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                  {summary?.total_orders ? summary.total_orders.toLocaleString() : '3,500'} Orders
                </div>
              </div>
            </div>
          </div>

          {/* Model Coefficients Table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
              Key Influential Drivers (Learned Log-Odds Coefficients)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {(summary?.top_features || []).map((feat, idx) => {
                const isPos = feat.coefficient > 0;
                return (
                  <div key={idx} style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>{feat.feature}</div>
                      <div style={{ fontSize: '0.75rem', color: isPos ? '#DC2626' : '#16A34A' }}>
                        {isPos ? 'Increases Return Risk' : 'Decreases Return Risk'}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isPos ? '#DC2626' : '#16A34A' }}>
                      {isPos ? `+${feat.coefficient}` : feat.coefficient}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '1.25rem 2rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748B' }}>
        Product Return Prediction • Predictive Analytics • Logistic Regression with Zero-Leakage Pipeline
      </footer>
    </div>
  );
}
