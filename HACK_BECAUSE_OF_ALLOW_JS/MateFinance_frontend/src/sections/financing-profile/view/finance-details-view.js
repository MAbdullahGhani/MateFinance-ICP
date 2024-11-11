import { Button, Container, IconButton } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import FinanceDetailsList from '../finance-details-list';
import { useRouter } from 'src/routes/hooks';
import SimpleCustomBreadcrumbs from 'src/components/simple-custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router';
const FinanceDetailsView = () => {
    const router = useRouter();
    const navigate = useNavigate();
    return (<>
      <Container maxWidth="xxl">
        <IconButton sx={{
            backgroundColor: 'black',
            '&:hover': {
                backgroundColor: 'black',
            },
        }} color="primary" size="small" onClick={() => navigate(-1)}>
          <Iconify icon="mingcute:arrow-left-fill" color="white"/>
        </IconButton>
        <SimpleCustomBreadcrumbs heading="Finance Details" subHeading="" links={[
            {
                name: 'Dashboard',
                href: paths.dashboard.root,
            },
            // {
            //   name: 'Borrowers',
            //   href: paths.dashboard.borrower.borrowerList,
            // },
            {
                name: 'Finance Details',
                // href: paths.dashboard.invoice.root,
            },
        ]} sx={{
            mb: { xs: 3, md: 5 },
        }}/>

        <FinanceDetailsList />
      </Container>
    </>);
};
export default FinanceDetailsView;
