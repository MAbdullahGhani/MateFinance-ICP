import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from 'src/theme/css';
import WelcomePage from './welcome-page';
// ----------------------------------------------------------------------
export default function AppWelcome({ title, description, action, img, showHelmet, ...other }) {
    const theme = useTheme();
    return (<>
      {showHelmet && (<Helmet>
          <title>Invoice Mate: Welcome</title>
        </Helmet>)}
      <Stack flexDirection={{ xs: 'column', md: 'row' }} sx={{
            ...bgGradient({
                direction: '135deg',
                startColor: alpha(theme.palette.primary.light, 0.2),
                endColor: alpha(theme.palette.primary.main, 0.2),
            }),
            height: showHelmet ? {} : { md: 1 },
            borderRadius: 2,
            position: 'relative',
            color: 'primary.darker',
            backgroundColor: 'common.white',
        }} {...other}>
        <Stack flexGrow={1} justifyContent="center" alignItems={{ xs: 'center', md: 'flex-start' }} sx={{
            p: {
                xs: theme.spacing(5, 3, 0, 3),
                md: theme.spacing(5),
            },
            textAlign: { xs: 'center', md: 'left' },
        }}>
          <WelcomePage />

          {/* <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            maxWidth: 360,
            mb: { xs: 3, xl: 5 },
          }}
        >
          {description}
        </Typography> */}

          {action && action}
        </Stack>

        {img && (<Stack component="span" justifyContent="center" sx={{
                p: { xs: 5, md: 3 },
                maxWidth: 360,
                mx: 'auto',
            }}>
            {img}
          </Stack>)}
      </Stack>
    </>);
}
AppWelcome.propTypes = {
    img: PropTypes.node,
    action: PropTypes.node,
    title: PropTypes.string,
    description: PropTypes.string,
    showHelmet: PropTypes.bool,
};
