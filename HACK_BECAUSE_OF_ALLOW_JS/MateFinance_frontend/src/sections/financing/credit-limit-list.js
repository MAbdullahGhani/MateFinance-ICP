import { useCallback, useEffect, useState } from 'react';
// @mui
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
// routes
// util
import { enqueueSnackbar } from 'notistack';
import axios, { endpoints } from 'src/utils/axios';
// components
import LoadingSpinner from 'src/components/loading-screen/loading-spinner';
import { useSettingsContext } from 'src/components/settings';
import { useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import CreditScore from './table/credit-limit-table/credit-score';
import FinancingLimits from './table/credit-limit-table/financing-limit';
//
// ----------------------------------------------------------------------
const defaultFilters = {
    status: 'credit score',
};
// ----------------------------------------------------------------------
const CreditLimitList = () => {
    const { t } = useLocales();
    const STATUS_OPTIONS = [
        { value: 'credit score', label: t(`${lang.financing}.creditScore`) },
        { value: 'financing limit', label: t(`${lang.financing}.financingLimit`) },
    ];
    const table = useTable();
    const loading = useBoolean();
    const settings = useSettingsContext();
    const [filters, setFilters] = useState(defaultFilters);
    const [finscore, setFinscore] = useState([]);
    const [creditScoreCriteriaList, setCreditScoreCriteriaList] = useState([]);
    const [scoreCount, setScoreCount] = useState(0);
    useEffect(() => {
        const getScores = async () => {
            loading.onTrue();
            try {
                const responce = await axios.get(endpoints.finance.getCreditScore);
                const finscores = await axios.get(endpoints.finance.getLevels);
                setCreditScoreCriteriaList(responce[0]);
                const score = parseFloat(responce[0].basicInfo.score) +
                    parseFloat(responce[0].minimumDays.score) +
                    parseFloat(responce[0].filer.score) +
                    parseFloat(responce[0].postDatedCheque.score) +
                    parseFloat(responce[0].guarantor.score) +
                    parseFloat(responce[0].repaymentHistory.score) +
                    parseFloat(responce[0].biometricVerification.score);
                setScoreCount(score);
                setFinscore(finscores);
            }
            catch (error) {
                enqueueSnackbar(error, { variant: 'error' });
            }
            loading.onFalse();
        };
        getScores();
    }, []);
    const handleFilters = useCallback((name, value) => {
        table.onResetPage();
        setFilters((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, [table]);
    const handleFilterStatus = useCallback((event, newValue) => {
        handleFilters('status', newValue);
    }, [handleFilters]);
    return (<Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {loading.value && <LoadingSpinner />}
      <Card>
        <Tabs value={filters.status} onChange={handleFilterStatus} sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}>
          {STATUS_OPTIONS.map((tab) => (<Tab key={tab.value} value={tab.value} label={tab.label}/>))}
        </Tabs>

        {filters.status === 'credit score' && (<CreditScore creditScoreCriteriaList={creditScoreCriteriaList} scoreCount={scoreCount}/>)}

        {filters.status === 'financing limit' && <FinancingLimits Finscore={finscore}/>}

        <Typography variant="body2" sx={{ my: 5, px: 2 }}>
          <span style={{ color: 'red' }}>Note: </span> {t(`${lang.financing}.note`)}
        </Typography>
      </Card>
    </Container>);
};
export default CreditLimitList;
// ----------------------------------------------------------------------
