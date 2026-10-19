import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { LoadingSpinner, ErrorAlert } from '../components/StatusComponents';
import { api } from '../services/api';

const COLORS = ['#2563EB', '#DC2626', '#16A34A', '#D97706', '#8B5CF6', '#EC4899'];

export default function EdaPage() {
  const [eda, setEda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getEda();
      setEda(res);
    } catch (err) {
      setError(err.message || 'Failed to load EDA data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Generating exploratory charts and statistical aggregations..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  const distData = eda?.return_distribution?.data || [];
  const catData = eda?.category_returns?.data || [];
  const delayData = eda?.delivery_delay?.data || [];
  const ratingData = eda?.product_rating?.data || [];
  const discountData = eda?.discount_impact?.data || [];
  const prevData = eda?.previous_returns?.data || [];
  const ageData = eda?.age_distribution?.data || [];
  const corrData = eda?.correlations?.data || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Exploratory Data Analysis (EDA)</h1>
        <p className="page-description">
          Detailed visual exploration of statistical associations between order attributes and customer return rates. Every chart includes empirical data and viva-ready analytical interpretations.
        </p>
      </div>

      {/* Row 1: Distribution & Category */}
      <div className="grid-2">
        {/* Chart 1: Return vs Non-Return */}
        <div className="card">
          <div className="card-title">
            <span>1. Target Class Distribution</span>
            <span className="badge badge-neutral">Class Imbalance</span>
          </div>
          <div className="card-subtitle">Count and proportion of retained orders vs returned items</div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={distData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percentage }) => `${name.split(' ')[0]} ${percentage}%`}
                >
                  <Cell fill="#2563EB" />
                  <Cell fill="#DC2626" />
                </Pie>
                <Tooltip formatter={(val) => [`${val} orders`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> {eda?.return_distribution?.interpretation}
          </div>
        </div>

        {/* Chart 2: Category Returns */}
        <div className="card">
          <div className="card-title">
            <span>2. Return Rate by Product Category</span>
            <span className="badge badge-neutral">Category Variance</span>
          </div>
          <div className="card-subtitle">Empirical return propensity across merchandise departments</div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={catData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="Product_Category" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 50]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Return Rate']} />
                <Bar dataKey="return_rate_percent" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> {eda?.category_returns?.interpretation}
          </div>
        </div>
      </div>

      {/* Row 2: Delivery Delay & Product Rating */}
      <div className="grid-2">
        {/* Chart 3: Delivery Delay */}
        <div className="card">
          <div className="card-title">
            <span>3. Delivery Delay vs. Return Rate</span>
            <span className="badge badge-high">Logistics Impact</span>
          </div>
          <div className="card-subtitle">Relationship between shipment timeliness and return risk</div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={delayData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="Delay_Bucket" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 60]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Return Rate']} />
                <Bar dataKey="return_rate_percent" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> {eda?.delivery_delay?.interpretation}
          </div>
        </div>

        {/* Chart 4: Product Rating */}
        <div className="card">
          <div className="card-title">
            <span>4. Product Rating vs. Return Rate</span>
            <span className="badge badge-low">Quality Signal</span>
          </div>
          <div className="card-subtitle">Correlation between product catalog ratings and return tendency</div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={ratingData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="Rating_Bucket" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 60]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Return Rate']} />
                <Bar dataKey="return_rate_percent" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> {eda?.product_rating?.interpretation}
          </div>
        </div>
      </div>

      {/* Row 3: Discount & Previous Returns */}
      <div className="grid-2">
        {/* Chart 5: Discount Percentage */}
        <div className="card">
          <div className="card-title">
            <span>5. Discount Percentage vs. Returns</span>
            <span className="badge badge-neutral">Pricing Sensitivity</span>
          </div>
          <div className="card-subtitle">Examining whether aggressive markdown discounts induce higher returns</div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={discountData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="Discount_Bucket" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 50]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Return Rate']} />
                <Bar dataKey="return_rate_percent" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> {eda?.discount_impact?.interpretation}
          </div>
        </div>

        {/* Chart 6: Previous Returns */}
        <div className="card">
          <div className="card-title">
            <span>6. Prior Return History vs. Current Return</span>
            <span className="badge badge-high">Customer History</span>
          </div>
          <div className="card-subtitle">Habitual return tendencies across repeated buyer segments</div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={prevData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="Prev_Return_Bucket" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 70]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Return Rate']} />
                <Bar dataKey="return_rate_percent" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> {eda?.previous_returns?.interpretation}
          </div>
        </div>
      </div>

      {/* Row 4: Age Group & Correlation Matrix */}
      <div className="grid-2">
        {/* Chart 7: Age Group */}
        <div className="card">
          <div className="card-title">
            <span>7. Customer Age Demographic vs. Returns</span>
            <span className="badge badge-neutral">Demographics</span>
          </div>
          <div className="card-subtitle">Return percentage across customer age cohorts</div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={ageData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="Age_Group" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 45]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Return Rate']} />
                <Bar dataKey="return_rate_percent" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> {eda?.age_distribution?.interpretation}
          </div>
        </div>

        {/* Chart 8: Correlations with Target */}
        <div className="card">
          <div className="card-title">
            <span>8. Pearson Correlation with Return_Status</span>
            <span className="badge badge-neutral">Feature Relevance</span>
          </div>
          <div className="card-subtitle">Linear statistical correlation between numerical features and target</div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={corrData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[-0.4, 0.4]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [val, 'Pearson r']} />
                <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                  {corrData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.correlation > 0 ? '#DC2626' : '#16A34A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-interpretation">
            <strong>Interpretation:</strong> {eda?.correlations?.interpretation}
          </div>
        </div>
      </div>
    </div>
  );
}
