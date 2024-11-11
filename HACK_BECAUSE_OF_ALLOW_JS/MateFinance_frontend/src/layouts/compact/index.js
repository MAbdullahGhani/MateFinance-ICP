import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Header from '../common/header-simple';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// ----------------------------------------------------------------------
export default function CompactLayout({ children }) {
    let custom = true;
    return (<>
      <Header custom={custom}/>
      {custom && (<Stack sx={{
                my: 9,
            }}>
          <CustomBreadcrumbs heading="Marketplace" links={[{ name: 'Marketplace' }]}/>
        </Stack>)}
      <Container component="main">
        <Stack sx={{
            m: 'auto',
            minHeight: '100vh',
            py: 10,
        }}>
          {children}
        </Stack>
      </Container>
    </>);
}
CompactLayout.propTypes = {
    children: PropTypes.node,
};
