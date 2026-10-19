import React from 'react';
import { Info, Code2, Terminal, CheckCircle2, Shield, FolderGit2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">About the Project</h1>
        <p className="page-description">
          Curriculum project specifications, system architecture, technology stack, and reproduction guidelines for university evaluation.
        </p>
      </div>

      <div className="grid-2">
        {/* Project Metadata */}
        <div className="card">
          <div className="card-title">
            <span>Academic Metadata</span>
            <span className="badge badge-low">
              <CheckCircle2 size={14} /> Verified Syllabus
            </span>
          </div>
          <div className="card-subtitle">Project identification and academic context</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PROJECT TITLE</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                Product Return Prediction using Predictive Analytics
              </div>
            </div>

            <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>COURSE SUBJECT</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                Predictive Analysis / Machine Learning
              </div>
            </div>

            <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PRIMARY ML TECHNIQUE</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                Logistic Regression (L2 Regularized with L-BFGS & GridSearchCV)
              </div>
            </div>

            <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EVALUATION METHODOLOGY</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Stratified 80/20 Holdout Split • 5-Fold Stratified Cross Validation • ROC-AUC & F1-Score
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card">
          <div className="card-title">
            <span>Technology Stack</span>
            <span className="badge badge-neutral">Production Ready</span>
          </div>
          <div className="card-subtitle">Reliable software architecture designed for college viva presentation</div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Technologies</th>
                  <th>Role in Architecture</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Frontend</td>
                  <td>React 18, Vite, Recharts, Lucide</td>
                  <td>Modern responsive dashboard & predictor UI</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Backend API</td>
                  <td>FastAPI, Uvicorn, Pydantic</td>
                  <td>REST endpoints & input validation schemas</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Machine Learning</td>
                  <td>scikit-learn, pandas, NumPy, joblib</td>
                  <td>Pipeline, ColumnTransformer, Logistic Regression</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Package Manager</td>
                  <td>uv (Python), npm (Node.js)</td>
                  <td>Deterministic, fast reproducible dependencies</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reproduction Instructions */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title">
          <span>How to Run Locally from Scratch</span>
          <span className="badge badge-neutral">
            <Terminal size={14} /> Reproduction
          </span>
        </div>
        <div className="card-subtitle">Terminal commands to retrain the model and launch both servers</div>

        <div className="grid-2" style={{ marginTop: '1rem', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
              1. Backend & ML Model
            </div>
            <pre style={{
              background: '#0F172A',
              color: '#E2E8F0',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              overflowX: 'auto',
              lineHeight: 1.5
            }}>
{`# 1. Create and activate virtual environment
uv venv backend/.venv --python 3.12
source backend/.venv/bin/activate

# 2. Install dependencies
uv pip install -r backend/requirements.txt

# 3. Train the model pipeline (or retrain anytime)
PYTHONPATH=. backend/.venv/bin/python backend/ml/train.py

# 4. Start FastAPI server
PYTHONPATH=. backend/.venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload`}
            </pre>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
              2. Frontend Web Application
            </div>
            <pre style={{
              background: '#0F172A',
              color: '#E2E8F0',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              overflowX: 'auto',
              lineHeight: 1.5
            }}>
{`# 1. Navigate to frontend directory
cd frontend

# 2. Install npm dependencies
npm install

# 3. Start development server
npm run dev

# App runs at: http://localhost:5173
# Automatically proxies /api to FastAPI on port 8000`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
