// Centralized API URL configuration
// In Docker (Vite), this comes from VITE_API_URL.
// In local dev, it falls back to localhost:3001.

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
