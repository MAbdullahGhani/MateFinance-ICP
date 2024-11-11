import { Card, Grid } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import CardStatsHorizontal from 'src/components/stateCard/horizontal-state-card';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import { fthousandNumber } from 'src/utils/format-number';
export default function CreditStats({ kpi }) {
    const { t } = useLocales();
    return (<div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <CardStatsHorizontal icon="fa6-solid:file-invoice-dollar" stats={fthousandNumber(kpi?.ReceivedInvoicesCount)} title={t(`${lang.kpi}.totalInvoices`)} iconSize="40px"/>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}>
            <GaugeChart id="gauge-chart3" nrOfLevels={4} colors={['#93154E', '#4D1360', '#69357A']} arcWidth={0.2} percent={kpi?.total ? kpi?.total / 10 : 0} textColor="black" style={{ width: '100%', maxWidth: '350px' }}/>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          {' '}
          <CardStatsHorizontal icon="wpf:sent" stats={fthousandNumber(kpi?.level?.amountTo)} title={t(`${lang.financing}.creditLimit`)} iconSize="40px"/>
        </Grid>
      </Grid>
    </div>);
}
