
import React from 'react';
import { Container, Grid } from '@mui/material';
import AnalyticsWidgetSummary from 'src/sections/dashboard/Analytics/AnalyticsWidgetSummary'; 
import { useSettingsContext } from 'src/components/settings';


function CounterIconWidget({ subscribersKpiData, handleKpiClick }) {
  const settings = useSettingsContext();

  return (
    <Grid container spacing={2}>
        <Grid item xs={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="Today"
            status={subscribersKpiData?.Today}
            color="#ffffff"
            bgcolor="#4D1360"
            onClick={() => handleKpiClick('today')}
            icon="quill:snooze-tomorrow"
          />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="Yesterday"
            status={subscribersKpiData?.Yesterday}
            color="#ffffff"
            bgcolor="#93154E"
            onClick={() => handleKpiClick('yesterday')}
            icon="ic:outline-today"
          />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="This Week"
            status={subscribersKpiData?.thisWeek}
            color="#ffffff"
            bgcolor="#4D1360"
            onClick={() => handleKpiClick('week')}
            icon="pixelarticons:calendar-week"
          />
        </Grid>

        <Grid item xs={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="This Month"
            status={subscribersKpiData?.thisMonth}
            color="#ffffff"
            bgcolor="#93154E"
            onClick={() => handleKpiClick('month')}
            icon="ic:outline-calendar-month"
          />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="All"
            status={subscribersKpiData?.total}
            color="#ffffff"
            bgcolor="#4D1360"
            onClick={() => handleKpiClick('total')}
            icon="mdi:invoice-clock"
          />
        </Grid>
      </Grid>
  );
}

export default CounterIconWidget;
