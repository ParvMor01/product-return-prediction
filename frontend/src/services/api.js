/**
 * API Service for Product Return Prediction.
 * Connects to the FastAPI backend with structured error handling.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  getHealth: () => request('/health'),
  getSummary: () => request('/summary'),
  getDataset: () => request('/dataset'),
  getEda: () => request('/eda'),
  getModelMetrics: () => request('/model/metrics'),
  getModelFeatures: () => request('/model/features'),
  predict: (data) =>
    request('/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
