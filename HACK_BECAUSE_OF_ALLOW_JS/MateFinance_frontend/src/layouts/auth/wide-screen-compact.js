// @mui
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
//
import Header from '../common/header-simple';
// ----------------------------------------------------------------------
export default function AuthWideScreenCompactLayout({ children, cardBgColor, activePage }) {
    // use for onboarding new user registration screen
    const mainScreenView = (<>
      <Header whiteLogo={true}/>

      <Box component="main" sx={{
            py: 12,
            display: 'flex',
            minHeight: '100vh',
            textAlign: 'center',
            px: { xs: 2, md: 0 },
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            '&:before': {
                width: 1,
                height: 1,
                zIndex: -1,
                content: "''",
                opacity: 0.94,
                position: 'absolute',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundImage: 'url(/assets/background/overlay_6.jpg)',
            },
        }}>
        <Card sx={{
            py: 1,
            px: 1,
            background: cardBgColor === 'none' ? 'none' : undefined,
            boxShadow: cardBgColor === 'none' ? 'none' : '',
            width: { xs: 350, sm: 400, md: 700 },
        }}>
          {children}
        </Card>
      </Box>
    </>);
    const fullWidthScreenView = (<>
      <Header />

      <Box component="main" sx={{
            py: 12,
            display: 'flex',
            minHeight: '100vh',
            // textAlign: 'center',
            px: { xs: 2, md: 0 },
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            '&:before': {
                width: 1,
                height: 1,
                zIndex: -1,
                content: "''",
                opacity: 0.94,
                position: 'absolute',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundImage: 'url(/assets/background/overlay_5.jpg)',
            },
        }}>
        <Card sx={{
            py: 2,
            // px: 3,
            background: cardBgColor === 'none' ? 'none' : undefined,
            boxShadow: cardBgColor === 'none' ? 'none' : '',
            width: { xs: '100%', sm: '100%', md: 1000 },
        }}>
          {children}
        </Card>
      </Box>
    </>);
    return activePage === 'invoice_view' ? fullWidthScreenView : mainScreenView;
}
AuthWideScreenCompactLayout.propTypes = {
    children: PropTypes.node,
    cardBgColor: PropTypes.string,
    activePage: PropTypes.string,
};
