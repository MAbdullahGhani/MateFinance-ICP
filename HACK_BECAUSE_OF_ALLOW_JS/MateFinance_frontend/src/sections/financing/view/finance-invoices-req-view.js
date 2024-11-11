// react imports
// @mui
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { Button } from '@mui/material';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import FinanceInvoicesReq from '../finance-invoice-req';
const FinanceInvoicesReqView = () => {
    const router = useRouter();
    const settings = useSettingsContext();
    const { t } = useLocales();
    return (<>
      <Container maxWidth="xxl">
        <CustomBreadcrumbs heading={t(`${lang.breadcrumb}.FinanceInvoices`)} links={[
            {
                name: 'Admin',
                href: paths.admin.root,
            },
            {
                name: t(`${lang.breadcrumb}.financing`),
                href: -1,
            },
            {
                name: 'Action',
                // href: -1,
            },
            // {
            //   name: 'Requested Finance Invoices ',
            // },
        ]} action={<Button color="primary" variant="contained" onClick={() => router.push(-1)}>
              Back
            </Button>} sx={{
            mb: { xs: 3, md: 5 },
        }}/>
      </Container>
      <FinanceInvoicesReq />
    </>);
};
export default FinanceInvoicesReqView;
