import React from 'react';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify/iconify';
import { lang } from 'src/locales/multiLang';
import { useLocales } from 'src/locales';

const TrustBox = () => {
  const { t } = useLocales();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        border: 1,
        borderRadius: 1,
        borderColor: 'grey.500',
        textAlign: 'center',
        fontSize: 14,
      }}
    >
      <Iconify icon="solar:shield-bold-duotone" color="purple" /> &nbsp;{' '}
      {t(`${lang.financing}.securityMessage`)}
    </Box>
  );
};

export default TrustBox;
