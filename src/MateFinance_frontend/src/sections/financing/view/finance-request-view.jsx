// @mui
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';

// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
//
import { paths } from 'src/routes/paths';
import RequestForFinancing from './request-for-financing';

//

// ----------------------------------------------------------------------

const FinanceRequestView = () => {
  const settings = useSettingsContext();
  const { t } = useLocales();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t(`${lang.financing}.requestForInvoiceFinancing`)}
        subHeading={t(`${lang.subheader}.FinancingProfile`)}
        links={[
          {
            name: t(`${lang.breadcrumb}.dashboard`),
            href: paths.dashboard.root,
          },
          {
            name: t(`${lang.breadcrumb}.financing`),
            // href: paths.dashboard.invoice.root,
          },
          {
            name: t(`${lang.financing}.requestForInvoiceFinancing`),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <RequestForFinancing />
    </Container>
  );
};

export default FinanceRequestView;
