/**
 * Development environment configuration
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
    enabled: false,
    autoLoginEmail: 'admin@finxp.local',
  },
};
