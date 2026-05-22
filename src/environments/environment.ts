/**
 * Development environment configuration
 * Used when running with: ng serve
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authUrl: 'http://localhost:8080/api/auth',
  logLevel: 'debug',
  enableDevTools: true,
  httpTimeout: 30000, // 30 seconds
  cache: {
    enabled: true,
    duration: 5 * 60 * 1000, // 5 minutes
  },
  // Mock auth config - Set to false when backend is ready
  mockAuth: {
    enabled: true,
    autoLoginEmail: 'admin@finxp.local',
  },
};
