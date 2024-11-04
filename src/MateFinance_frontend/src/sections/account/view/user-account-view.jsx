import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../account-general';
import AccountBilling from '../account-billing';
import AccountSocialLinks from '../account-social-links';
import AccountNotifications from '../account-notifications';
import AccountChangePassword from '../account-change-password';
import StepOneUserInfoForm from '../onboarding-form';
import AccountWallets from '../account-wallets';
import Transaction from '../transaction';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  // {
  //   value: 'notifications',
  //   label: 'Notifications',
  //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  // },
  {
    value: 'social',
    label: 'Documents',
    icon: <Iconify icon="fluent-mdl2:onboarding" width={24} />,
  },
  {
    value: 'wallets',
    label: 'Wallets',
    icon: <Iconify icon="material-symbols:wallet" width={24} />,
  },
  {
    value: 'transactions',
    label: 'Transactions',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  // {
  //   value: 'security',
  //   label: 'Security',
  //   icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  // },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ background: '#f6f7f8' }}>
        <Typography variant="h3" gutterBottom>
          Settings
        </Typography>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {currentTab === 'general' && <AccountGeneral />}

        {currentTab === 'transactions' && <Transaction />}

        {currentTab === 'billing' && (
          <AccountBilling
            plans={_userPlans}
            cards={_userPayment}
            invoices={_userInvoices}
            addressBook={_userAddressBook}
          />
        )}

        {currentTab === 'wallets' && <AccountWallets />}

        {currentTab === 'notifications' && <AccountNotifications />}

        {currentTab === 'social' && <StepOneUserInfoForm profile={true} />}

        {currentTab === 'security' && <AccountChangePassword />}
      </Container>
    </>
  );
}
