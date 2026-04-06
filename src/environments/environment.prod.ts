/**
 * Production environment configuration
 * Used when running with: ng build --configuration production
 */
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.finxp.com/api',
  authUrl: process.env['AUTH_URL'] || 'https://auth.finxp.com/auth',
  logLevel: 'error',
  enableDevTools: false,
  httpTimeout: 30000,
  cache: {
    enabled: true,
    duration: 10 * 60 * 1000, // 10 minutes
  },
  mockAuth: {
    enabled: false,
  },
};
