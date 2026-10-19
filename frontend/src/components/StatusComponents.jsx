import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading analytics data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
      <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.75rem', color: 'var(--primary-blue)' }} />
      <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function ErrorAlert({ message, onRetry }) {
  return (
    <div style={{
      background: 'var(--danger-red-light)',
      border: '1px solid rgba(220, 38, 38, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      margin: '1.5rem 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.85rem'
    }}>
      <AlertCircle size={22} style={{ color: 'var(--danger-red)', flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: 'var(--danger-red)', marginBottom: '0.25rem' }}>Service Notice</div>
        <div style={{ fontSize: '0.875rem', color: '#7F1D1D' }}>{message}</div>
        {onRetry && (
          <button 
            onClick={onRetry}
            style={{
              marginTop: '0.75rem',
              padding: '0.4rem 0.85rem',
              background: 'var(--danger-red)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry Request
          </button>
        )}
      </div>
    </div>
  );
}
