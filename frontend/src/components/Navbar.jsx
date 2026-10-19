import React from 'react';
import { 
  BarChart3, 
  Database, 
  Sliders, 
  PieChart, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  Info,
  Package
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'dataset', label: 'Dataset', icon: Database },
  { id: 'preprocessing', label: 'Preprocessing', icon: Sliders },
  { id: 'eda', label: 'EDA', icon: PieChart },
  { id: 'training', label: 'Model Training', icon: Cpu },
  { id: 'evaluation', label: 'Model Evaluation', icon: CheckCircle2 },
  { id: 'prediction', label: 'Predict Risk', icon: Sparkles },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'about', label: 'About', icon: Info },
];

export default function Navbar({ activeTab, onSelectTab, isHealthy }) {
  return (
    <header className="top-header">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-icon">
            <Package size={22} />
          </div>
          <div>
            <div className="brand-title">Product Return Prediction</div>
            <div className="brand-subtitle">Predictive Analytics Platform • Logistic Regression</div>
          </div>
        </div>

        <div className="status-badge" title="Model Pipeline Status">
          <div className="status-dot"></div>
          <span>{isHealthy ? 'Model Online' : 'Connecting...'}</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0.4rem 1.5rem' }}>
          <nav className="nav-links">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
