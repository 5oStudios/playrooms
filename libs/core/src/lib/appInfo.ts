const apiDomain =
  process.env['NEXT_PUBLIC_BACKEND_URL'] ?? 'https://api-kingo.5ostudios.com';
const websiteDomain = process.env['FRONTEND_URL'] ?? 'https://kingo.5ostudios.com';
export const appInfo = {
  // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
  appName: 'Kingo',
  apiDomain,
  websiteDomain,
  apiBasePath: '/auth',
  websiteBasePath: '/api/auth',
};
