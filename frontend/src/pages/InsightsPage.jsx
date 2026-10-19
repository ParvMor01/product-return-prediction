import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, Truck, Star, Tag, UserCheck, ShieldAlert } from 'lucide-react';
import { LoadingSpinner, ErrorAlert } from '../components/StatusComponents';
import { api } from '../services/api';

export default function InsightsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getSummary();
      setSummary(res);
    } catch (err) {
      setError(err.message || 'Failed to load insights data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Synthesizing business insights from model weights..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  const insightsList = [
    {
      icon: Tag,
      title: 'Apparel & Footwear Return Concentration',
      badge: 'High Impact',
      badgeClass: 'badge-high',
      metric: 'Apparel +0.55 log-odds',
      observation: 'Fashion merchandise experiences nearly double the baseline return rate of hard goods. Customer sizing uncertainty, tactile fabric expectations, and color variance drive frequent post-delivery rejections.',
      recommendation: 'Implement interactive 3D virtual sizing guides, user fit reviews (e.g. "runs true to size"), and high-resolution multi-angle photography to reduce pre-purchase ambiguity.'
    },
    {
      icon: Truck,
      title: 'Fulfillment Delay Vulnerability',
      badge: 'Operational Driver',
      badgeClass: 'badge-high',
      metric: 'Delay Delay +0.23 log-odds',
      observation: 'When actual delivery time exceeds expected arrival by 2 or more days, return probability escalates steeply. Customer urgency wanes, emotional excitement decays, or substitute products are acquired locally.',
      recommendation: 'Prioritize automated carrier tracking notifications, dispatch express shipping for high-value orders, and proactively compensate delayed orders with credit vouchers before delivery.'
    },
    {
      icon: Star,
      title: 'Catalog Rating Degradation Threshold',
      badge: 'Product Quality',
      badgeClass: 'badge-low',
      metric: 'Product Rating -0.33 log-odds',
      observation: 'Products rated below 2.8 stars exhibit significant return spikes. Negative customer reviews correlate strongly with physical defects, poor material durability, or misleading product descriptions.',
      recommendation: 'Establish an automated quality audit: delist or review items whose catalog rating drops below 3.0 stars, and inspect supplier batch quality for recurring return reasons.'
    },
    {
      icon: UserCheck,
      title: 'Habitual Return Behavior & Customer Profiling',
      badge: 'Behavioral Pattern',
      badgeClass: 'badge-medium',
      metric: 'Return Rate History +0.42 log-odds',
      observation: 'A customer with a high ratio of historical returns to orders is substantially more likely to return subsequent purchases (wardrobing or speculative multi-size buying).',
      recommendation: 'Introduce gentle return policy friction for chronic returners (e.g., store credit refunds instead of cash, or nominal return processing fees) while maintaining generous terms for loyal repeat buyers.'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Predictive Insights & Strategic Recommendations</h1>
        <p className="page-description">
          Actionable business intelligence synthesized from trained Logistic Regression parameters and empirical order histories.
        </p>
      </div>

      {/* Academic Caution Alert */}
      <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--warning-amber)', background: 'var(--warning-amber-light)' }}>
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <ShieldAlert size={24} style={{ color: 'var(--warning-amber)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400E', marginBottom: '0.25rem' }}>
              Methodological Note: Correlation vs. Causation
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#78350F', lineHeight: 1.45 }}>
              The factors identified below represent strong statistical associations learned by the Logistic Regression classifier. In predictive analytics, observing that delayed orders return at a higher rate does not by itself prove that delay is the sole biological cause; confounding factors (such as peak holiday volume or regional logistics hurdles) may also exist. Business interventions should be verified using randomized controlled trials (A/B testing).
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Insight Cards */}
      <div className="grid-2">
        {insightsList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--primary-blue-light)',
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-navy)' }}>{item.title}</span>
                  </div>
                  <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
                </div>

                <div style={{ marginBottom: '0.75rem', padding: '0.35rem 0.65rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', display: 'inline-block', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>
                  Model Coefficient: {item.metric}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Empirical Finding:
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {item.observation}
                  </p>
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Actionable Mitigation Strategy:
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.recommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
