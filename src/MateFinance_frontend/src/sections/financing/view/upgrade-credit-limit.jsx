import { Container, Divider } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import LoadingSpinner from 'src/components/loading-screen/loading-spinner';
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import { getUserFinance } from 'src/redux/slices/user';
import { paths } from 'src/routes/paths';
import axios, { endpoints } from 'src/utils/axios';
import CreditStats from '../credit-stats';
import UpgradeCreditScore from '../table/credit-limit-table/upgrade-credit-score-action';

export default function UpgradeCreditLimit() {
  // *redux
  const {
    auth: {
      userData: { userId },
    },
    user: {
      kpi,
      userFinance: { creditScore },
    },
  } = useSelector((state) => state);

  const loading = useBoolean();

  const [creditScoreCriteriaList, setCreditScoreCriteriaList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getScores = async () => {
      loading.onTrue();
      try {
        dispatch(getUserFinance(userId));
        const responce = await axios.get(endpoints.finance.getCreditScore);
        setCreditScoreCriteriaList(responce[0]);
      } catch (error) {
        enqueueSnackbar(error.err, {
          variant: 'error',
        });
      }
      loading.onFalse();
    };

    getScores();
  }, []);

  const { t } = useLocales();
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading={t(`${lang.sidebar}.upgradeCreditLimit`)}
        subHeading={t(`${lang.subheader}.UpgradeCreditLimit`)}
        links={[
          {
            name: t(`${lang.breadcrumb}.dashboard`),
            href: paths.dashboard.root,
          },
          {
            name: t(`${lang.financing}.credit`),
            // href: paths.dashboard.invoice.root,
          },
          {
            name: t(`${lang.sidebar}.upgradeCreditLimit`),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {loading.value && <LoadingSpinner />}
      <CreditStats kpi={kpi} />
      {/* # */}
      <Divider sx={{ my: 2 }} />
      {/* # */}
      <UpgradeCreditScore
        creditScore={creditScore}
        creditScoreCriteriaList={creditScoreCriteriaList}
      />
    </Container>
  );
}
