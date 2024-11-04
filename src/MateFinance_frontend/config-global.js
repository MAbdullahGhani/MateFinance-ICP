import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API;
export const IM_HOST_API = import.meta.env.VITE_HOST_IMAPI;
export const IM_HOST_UI = import.meta.env.VITE_HOST_IM;
export const IM_HOST_EXPLORER = import.meta.env.VITE_HOST_BLOCK_EXPLORER;
export const IM_HOST_ARB_EXPLORER = import.meta.env.VITE_HOST_BLOCK_ARB_EXPLORER;
export const CRED_HOST_API = import.meta.env.VITE_HOST_CREDAPI;
export const ATTACHMENT_URL = import.meta.env.VITE_HOST_ATTACHMENT_URL;
export const ATTACHMENT_TOKEN = import.meta.env.VITE_HOST_ATTACHMENT_TOKEN;
export const IM_ATTACHMENT_URL = import.meta.env.VITE_HOST_IM_ATTACHMENT_URL;
export const IM_ATTACHMENT_TOKEN = import.meta.env.VITE_HOST_IM_ATTACHMENT_TOKEN;
export const SMART_CON_ADDRESS = import.meta.env.VITE_HOST_SMART_CON_ADDRESS;
export const WALLET_KEY = import.meta.env.VITE_HOST_WALLET_PRIVATE_KEY;
export const SMART_CON_URL = import.meta.env.VITE_HOST_SMART_CON_ADDRESS_URL;

export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

// GOOGLE RECAPTCHA_API
export const RECAPTCHA_KEY = import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY;

export const FIREBASE_API = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: import.meta.env.VITE_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL,
};

export const SUPABASE_API = {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'

export function statusColors(status) {
  switch (status) {
    case 'financeRequest':
      return 'yellow';
    case 'tokenized':
      return '#ADD8E6';
    case 'lending':
      return '#98FF98';
    case 'closed':
      return '#D3D3D3';
    case 'repayment':
      return '#bd92d4';
    case 'expired':
      return '#F08080';
    case 'cancelled':
      return '#FFC1C1';
    case 'rejected':
      return '#FFB6C1';
    default:
      return '#637381';
  }
}
