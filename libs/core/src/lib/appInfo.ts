const apiDomain =
  process.env['NEXT_PUBLIC_BACKEND_URL'] ?? 'http://localhost:3000';
const websiteDomain = process.env['FRONTEND_URL'] ?? 'http://localhost:3001';
export const appInfo = {
  // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
  appName: 'Kingo',
  apiDomain,
  websiteDomain,
  apiBasePath: '/auth',
  websiteBasePath: '/api/auth',
};
