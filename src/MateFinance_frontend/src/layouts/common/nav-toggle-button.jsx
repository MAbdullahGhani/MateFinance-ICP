import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { NAV } from '../config-layout';

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  if (!lgUp) {
    return null;
  }

  return (
    <IconButton
      size="small"
      onClick={() =>
        settings.onUpdate('themeLayout', settings.themeLayout === 'vertical' ? 'mini' : 'vertical')
      }
      sx={{
        p: 0.5,
        top: 32,
        position: 'fixed',
        left: NAV.W_VERTICAL - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        backgroundColor: 'primary.main',
        // ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'primary.light',
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={16}
        color={theme.palette.common.white}
        icon={
          settings.themeLayout === 'vertical'
            ? 'eva:arrow-ios-back-fill'
            : 'eva:arrow-ios-forward-fill'
        }
      />
    </IconButton>
  );
}

NavToggleButton.propTypes = {
  sx: PropTypes.object,
};