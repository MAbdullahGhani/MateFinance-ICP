// @mui
import { Box, Card, CardHeader } from '@mui/material';
import { useMemo } from 'react';
import { useChart } from 'src/components/chart';
import Chart from 'src/components/chart/chart';
// ----------------------------------------------------------------------

export default function BankStatementsStackedCharts({
  userDetail,
  subheader,
  chart,
  title,
  ...other
}) {
  const { months, data: graphData } = chart; // Extract data for the graph

  const options = useChart(
    useMemo(() => {
      return {
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '50%',
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'last',
          },
        },

        stroke: { show: true },
        xaxis: { categories: months },

        yaxis: {
          labels: {
            formatter: (value) => {
              if (value <= -1000000)
                return `${userDetail?.geoLocation?.currencyCode} -${(value / -1000000).toFixed(
                  1
                )}M`;
              if (value <= -1000)
                return `${userDetail?.geoLocation?.currencyCode} -${(value / -1000).toFixed(1)}K`;
              if (value >= 1000000)
                return `${userDetail?.geoLocation?.currencyCode} ${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000)
                return ` ${userDetail?.geoLocation?.currencyCode} ${(value / 1000).toFixed(1)}K`;

              return `${userDetail?.geoLocation?.currencyCode} ${value || 0}`;
            },
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
      };
    }, [chart, months]) // Update dependencies
  );

  return (
    <Box {...other}>
      <>
        <CardHeader subheader={subheader} title={title} />
        <Chart dir="ltr" type="bar" series={graphData} options={options} height={364} />
      </>
    </Box>
  );
}
