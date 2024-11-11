import { useState } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { bgBlur } from 'src/theme/css';
import Logo from 'src/components/logo';
import { HEADER } from '../config-layout';
import HeaderShadow from './header-shadow';
import SettingsButton from './settings-button';
import { Box, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------
export default function HeaderSimple({ whiteLogo, custom }) {
    const theme = useTheme();
    const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    return (<AppBar>
      <Toolbar sx={{
            justifyContent: 'space-between',
            height: {
                xs: HEADER.H_MOBILE,
                md: HEADER.H_DESKTOP,
            },
            transition: theme.transitions.create(['height'], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
            }),
            ...(offsetTop && {
                ...bgBlur({
                    color: theme.palette.background.default,
                }),
                height: {
                    md: HEADER.H_DESKTOP_OFFSET,
                },
            }),
        }}>
        {!whiteLogo && <Logo />}
        {whiteLogo && (<Box component="img" src="/logo/white_logo_one.png" sx={{ width: 180, cursor: 'pointer' }}/>)}
        {custom && (<>
            {isMobile ? ('') : (<Stack flexDirection={{
                    xs: 'column',
                    md: 'row',
                }} justifyContent="space-between" gap={2} sx={{
                    width: {
                        xs: '100%',
                        md: 'auto',
                    },
                    alignItems: {
                        xs: 'center',
                        md: 'flex-start',
                    },
                }}>
                <Link href={paths.auth.jwt.register} component={RouterLink} color="inherit" sx={{ typography: 'subtitle2' }}>
                  Apply to Whitelist
                </Link>
                <Link href={paths.auth.jwt.disclaimer} component={RouterLink} color="inherit" sx={{ typography: 'subtitle2' }}>
                  Disclaimer
                </Link>
              </Stack>)}
          </>)}
        <Stack direction="row" alignItems="center" spacing={1}>
          {custom && !isMobile && (<Link href={paths.auth.jwt.login} component={RouterLink} color="inherit" sx={{ typography: 'subtitle2' }}>
              Already have an account?
            </Link>)}
          {isMobile ? (<>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                <Iconify icon="gg:menu-round" sx={{ color: '#9E2654' }}/>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>
                  <Link href={paths.auth.jwt.register} component={RouterLink} color="inherit" sx={{ typography: 'subtitle2' }}>
                    Apply to Whitelist
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link href={paths.auth.jwt.disclaimer} component={RouterLink} color="inherit" sx={{ typography: 'subtitle2' }}>
                    Disclaimer
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link href={paths.auth.jwt.login} component={RouterLink} color="inherit" sx={{ typography: 'subtitle2' }}>
                    Already have an account?
                  </Link>
                </MenuItem>
              </Menu>
            </>) : ('')}
          <SettingsButton />
        </Stack>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>);
}
