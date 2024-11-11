import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack, Typography } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import Header from '../common/header-simple';
import { m, useScroll } from 'framer-motion';
import { textGradient, bgGradient, bgBlur } from 'src/theme/css';
import { useResponsive } from 'src/hooks/use-responsive';
import Logo from 'src/components/logo';
import { varFade } from 'src/components/animate';
// ----------------------------------------------------------------------
export default function AuthModernCompactLayout({ children }) {
    const theme = useTheme();
    const upMd = useResponsive('up', 'md');
    const renderContent = (<Stack flexGrow={0.4}>
      <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%', ml: 3.5 }}>
        <Logo sx={{ width: 150 }}/>
      </Box>
      <Stack sx={{
            width: 1,
            mx: 'auto',
            maxWidth: 600,
            px: { xs: 2, md: 10 },
        }}>
        <Card sx={{
            py: { xs: 5, md: 0 },
            px: { xs: 3, md: 0 },
            boxShadow: { md: 'none' },
            overflow: { md: 'unset' },
        }}>
          {children}
        </Card>
      </Stack>
    </Stack>);
    // sx={{
    //   position: 'relative',
    //   backgroundImage: 'url(/assets/background/graphic_side.png)',
    //   backgroundSize: 'cover',
    //   backgroundRepeat: 'no-repeat',
    // }}
    const renderSection = (<Box width={'51%'} sx={{ left: '49%' }} position={'absolute'}>
      <img src="/assets/background/graphic_side.png" width="100%" height={window.innerHeight}/>
    </Box>);
    return (<>
      <Stack component="main" direction="row" sx={{
            minHeight: '100vh',
        }}>
        <Box sx={{
            zIndex: 100,
            width: '50%',
            height: '100%',
            position: 'absolute',
            borderRadius: '20px',
            backgroundColor: 'white',
        }}>
          {renderContent}
        </Box>

        {/* {upMd && (
          // <Box
          //   sx={{
          //     width: '51%',
          //     height: '100%',
          //   }}
          // >
            {renderSection}
          // </Box>
        )} */}
        {upMd && renderSection}
      </Stack>
    </>);
}
AuthModernCompactLayout.propTypes = {
    children: PropTypes.node,
};
