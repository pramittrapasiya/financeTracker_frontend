// API Configuration
// Change the API URL in the .env file

// Get API URL from environment variable, fallback to local if not set
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Determine environment based on URL
export const ENVIRONMENT = API_BASE_URL.includes('localhost') ? 'development' : 'production';
export const IS_LIVE = !API_BASE_URL.includes('localhost');

// Log current configuration
console.log('🌐 API Configuration:', {
    baseURL: API_BASE_URL,
    environment: ENVIRONMENT,
    isLive: IS_LIVE
});

