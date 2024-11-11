// react imports
// @mui
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import { paths } from 'src/routes/paths';
import CreditLimitList from '../credit-limit-list';
// ----------------------------------------------------------------------
const CreditListView = () => {
    const settings = useSettingsContext();
    const { t } = useLocales();
    return (<>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading={t(`${lang.financing}.creditLimit`)} subHeading={t(`${lang.subheader}.creditLimit`)} links={[
            {
                name: t(`${lang.breadcrumb}.dashboard`),
                href: paths.dashboard.root,
            },
            {
                name: t(`${lang.financing}.credit`),
                // href: paths.dashboard.invoice.root,
            },
            {
                name: t(`${lang.financing}.creditLimit`),
            },
        ]} sx={{
            mb: { xs: 3, md: 5 },
        }}/>
      </Container>

      <CreditLimitList />
    </>);
};
export default CreditListView;
