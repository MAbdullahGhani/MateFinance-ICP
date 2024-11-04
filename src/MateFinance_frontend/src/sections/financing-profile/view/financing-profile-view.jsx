import { Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import FinancingProfileList from '../financing-profiles-list';

const FinancingProfileView = () => {
  return (
    <>
      <Container maxWidth="xxl">
        <CustomBreadcrumbs
          heading="Financing Profiles"
          subHeading=""
          links={[
            {
              name: 'Admin',
              href: paths.admin.root,
            },
            {
              name: 'Financing',
              // href: paths.dashboard.invoice.root,
            },
            {
              name: 'Financing Profiles',
              // href: paths.dashboard.invoice.root,
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      </Container>

      <FinancingProfileList />
    </>
  );
};

export default FinancingProfileView;
