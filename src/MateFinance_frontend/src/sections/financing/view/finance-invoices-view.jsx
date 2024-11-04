// react imports

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
import FinanceInvoicesList from '../finance-invoices-list';

const FinanceInvoicesView = () => {
  const { t } = useLocales();

  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t(`${lang.breadcrumb}.FinanceInvoices`)}
          subHeading={t(`${lang.subheader}.InvoiceFinancing`)}
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
              name: t(`${lang.breadcrumb}.FinanceInvoices`),
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      </Container>
      <FinanceInvoicesList />
    </>
  );
};

export default FinanceInvoicesView;
