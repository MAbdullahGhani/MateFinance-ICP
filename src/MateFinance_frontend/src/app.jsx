/* eslint-disable perfectionist/sort-imports */
import './global.css';

// i18n
import './locales/i18n';

// ----------------------------------------------------------------------

import Router from './routes/sections';

import ThemeProvider from './theme';

import { LocalizationProvider } from './locales';

import { useScrollToTop } from './hooks/use-scroll-to-top';

import ProgressBar from './components/progress-bar';
import { MotionLazy } from './components/animate/motion-lazy';
import SnackbarProvider from './components/snackbar/snackbar-provider';
import { SettingsDrawer, SettingsProvider } from './components/settings';

import { CheckoutProvider } from './sections/checkout/context';

import { AuthProvider } from './auth/context/jwt';
// import { AuthProvider } from './auth/context/auth0';
// import { AuthProvider } from './auth/context/amplify';
// import { AuthProvider } from './auth/context/firebase';
// import { AuthProvider } from './auth/context/supabase';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { WagmiConfig } from 'wagmi';
import { arbitrum, arbitrumSepolia, mainnet, haqqMainnet, haqqTestedge2 } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function App() {
  // 0. Setup queryClient
  const queryClient = new QueryClient();

  // 1. Get projectId at https://cloud.walletconnect.com
  const projectId = 'ceb0d680c2efe34ad55896c30a2abc74';

  // 2. Create wagmiConfig
  const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  };

  const chains = [mainnet, arbitrum, arbitrumSepolia, haqqMainnet, haqqTestedge2];
  const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
  });

  // 3. Create modal
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
  });

  const getAllCountries = () => {
    try {
      fetch('https://beta.invoicemate.net/api/country/getAllCountriesThroughLibrary')
        .then((response) => response.json())
        .then((data) => {
          console.log("🔥",data);
        });
      
    } catch (error) {
      console.error(error);
      
    }
  }

  useEffect(() => {
    getAllCountries();
  }, []);
  return (
    <AuthProvider>
      <LocalizationProvider>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light', // 'light' | 'dark'
            themeDirection: 'ltr', //  'rtl' | 'ltr'
            themeContrast: 'bold', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <CheckoutProvider>
                  <SettingsDrawer />
                  <ProgressBar />
                  <QueryClientProvider client={queryClient}>
                    <WagmiConfig config={config}>
                      <Router />
                    </WagmiConfig>
                  </QueryClientProvider>
                </CheckoutProvider>
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}
