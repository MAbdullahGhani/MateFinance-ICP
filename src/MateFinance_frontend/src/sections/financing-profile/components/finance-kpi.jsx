import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import GaugeChart from 'src/components/chart/GaugeChart';
import Iconify from 'src/components/iconify/iconify';

export default function FinanceKpi({ userFinanceKPIs }) {
  function fthousandNumber(number) {
    return numeral(number).format('0,000');
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent="space-between"
      style={{
        padding: '10px',
      }}
    >
      <Grid item xs={12} md={3.3}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h4" color="primary">
              {userFinanceKPIs ? fthousandNumber(userFinanceKPIs.remainingAmount) : 0}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="secondary">
                Remaining Amount
              </Typography>
              <Iconify icon="ic:baseline-assessment" variant="contained" marginTop="4px" />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5} lg={5.5} marginTop={-4}>
        <GaugeChart userFinanceKPIs={userFinanceKPIs} label="Credit Score" />
      </Grid>
      <Grid item xs={12} md={3.1}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h4" color="primary">
              {userFinanceKPIs
                ? (userFinanceKPIs.maxLimit && fthousandNumber(userFinanceKPIs.maxLimit)) ||
                  fthousandNumber(userFinanceKPIs?.level?.amountTo)
                : 0}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="secondary">
                Credit Limit
              </Typography>
              <Iconify icon="iconamoon:send-fill" variant="contained" marginTop="4px" />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
