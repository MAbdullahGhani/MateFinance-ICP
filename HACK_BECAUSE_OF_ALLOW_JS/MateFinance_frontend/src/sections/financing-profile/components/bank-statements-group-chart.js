// @mui
import { Box, ButtonBase, Card, CardContent, CardHeader, Grid, Link, MenuItem, Typography, } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useChart } from 'src/components/chart';
import Chart from 'src/components/chart/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { fthousandNumber } from 'src/utils/format-number';
import BankStatementsStackedCharts from './bank-statements-stacked-chart';
// ----------------------------------------------------------------------
export default function BankStatementsGroupCharts({ userDetail, subheader, chart, ...other }) {
    const { GroupChart, StackChart, creditDebitOnly } = chart;
    const popover = usePopover();
    const [selectedSeries, setSelectedSeries] = useState('');
    const selectedChart = GroupChart.find((item) => item.id === selectedSeries);
    useEffect(() => {
        setSelectedSeries(GroupChart[0]?.id || '');
    }, [GroupChart]);
    const options = useChart(useMemo(() => {
        const categories = selectedChart?.chart?.categories ?? [];
        return {
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2 },
            xaxis: { categories: categories },
            yaxis: {
                labels: {
                    formatter: (value) => {
                        if (value >= 1000000)
                            return `${userDetail?.geoLocation?.currencyCode} ${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000)
                            return `${userDetail?.geoLocation?.currencyCode} ${(value / 1000).toFixed(1)}K`;
                        return `${userDetail?.geoLocation?.currencyCode} ${value}`;
                    },
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
        };
    }, [chart, selectedSeries]));
    const handleChangeSeries = useCallback((newValue) => {
        popover.onClose();
        const selected = GroupChart.find((item) => item.id === newValue.id);
        setSelectedSeries(selected.id);
    }, [popover]);
    return (<Card {...other}>
      {GroupChart[0]?.chart?.categories.length > 0 && (<>
          <CardHeader subheader={subheader} title="Cash Flow Analysis" action={<ButtonBase onClick={popover.onOpen} sx={{
                    pl: 1,
                    py: 0.5,
                    pr: 0.5,
                    borderRadius: 1,
                    typography: 'subtitle2',
                    bgcolor: 'background.neutral',
                }}>
                {selectedChart?.graphType}
                <Iconify width={16} icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} sx={{ ml: 0.5 }}/>
              </ButtonBase>}/>
          {GroupChart.map((item, index) => (<Box key={index} sx={{ mt: 3, mx: 3 }}>
              {item.id === selectedSeries && (<>
                  <Chart key={item.graphType} dir="ltr" type="bar" series={item?.chart?.series} options={options} height={364}/>
                  {StackChart.map((stack) => stack.id === selectedSeries && (<BankStatementsStackedCharts chart={stack} userDetail={userDetail} title={<p>
                              Credit - Debit Analysis <br /> A.
                            </p>}/>))}

                  {creditDebitOnly.map((stack) => stack.id === selectedSeries && (<BankStatementsStackedCharts chart={stack} userDetail={userDetail} title={<p>B.</p>}/>))}

                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Typography variant="body1" display="flex" alignItems="center">
                          <Iconify icon="mdi:file-document-outline" color="purple" style={{ marginRight: '0.5rem' }}/>{' '}
                          Document:
                        </Typography>
                        <Typography variant="body1" component="a" href={item?.info?.filePath} target="_blank" rel="noopener noreferrer" color="inherit">
                          {item?.graphType}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body1" display="flex" alignItems="center">
                          <Iconify icon="mdi:cash-multiple" color="purple" style={{ marginRight: '0.5rem' }}/>{' '}
                          Average Balance:
                        </Typography>
                        <Typography variant="body1">
                          {fthousandNumber(item?.info?.AverageBalance)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body1" display="flex" alignItems="center">
                          <Iconify icon="mdi:calendar-range" color="purple" style={{ marginRight: '0.5rem' }}/>{' '}
                          From:
                        </Typography>
                        <Typography variant="body1">{item?.info?.FromDate}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body1" display="flex" alignItems="center">
                          <Iconify icon="mdi:calendar-range" color="purple" style={{ marginRight: '0.5rem' }}/>{' '}
                          To:
                        </Typography>
                        <Typography variant="body1">{item?.info?.ToDate}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </>)}
            </Box>))}

          <CustomPopover open={popover.open} onClose={popover.onClose}>
            {GroupChart.map((option, index) => (<MenuItem key={index} selected={option.id === selectedSeries} onClick={() => handleChangeSeries(option)}>
                {option.graphType}
              </MenuItem>))}
          </CustomPopover>
        </>)}
    </Card>);
}
