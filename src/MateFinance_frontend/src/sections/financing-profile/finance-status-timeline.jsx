import { useEffect, useState } from 'react';

// @mui
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
// utils
import moment from 'moment';
import { useLocales } from 'src/locales';
// import { lang } from 'src/locales/multiLang';
import { TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import Iconify from 'src/components/iconify';
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function FinanceStatusTimeLine({ invoice }) {
  const [steps, setSteps] = useState([
    { label: 'Finance Request', key: 'financeRequest' },
    { label: 'Tokenized', key: 'tokenized' },
    { label: 'Lending', key: 'lending' },
    { label: 'Closed', key: 'closed' },
    { label: 'Repayment', key: 'repayment' },
    { label: 'Expired', key: 'expired' },
    { label: 'Cancelled', key: 'cancelled' },
    { label: 'Rejected', key: 'rejected' },
  ]);

  return (
    <div>
      <Timeline position="alternate">
        {steps.map((step, index) => {
          const stepData = invoice[step?.key];
          const isCompleted = stepData?.status;
          const statusDate = stepData?.statusDate ? fDateTime(stepData?.statusDate) : '-';

          return (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={isCompleted ? 'primary' : 'grey'}>
                  {isCompleted ? (
                    <Iconify icon={'material-symbols:done'} />
                  ) : (
                    <Iconify icon={'material-symbols:pending-actions-rounded'} />
                  )}
                </TimelineDot>
                {index < steps.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="button" display="block" gutterBottom>
                  {step?.label}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  color={isCompleted ? 'textPrimary' : 'textSecondary'}
                >
                  {statusDate}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
}

FinanceStatusTimeLine.propTypes = {
  invoice: PropTypes.object,
};

// ----------------------------------------------------------------------

function OrderItem({ item, lastTimeline }) {
  const { description, label, request } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot style={description ? { backgroundColor: '#5a2c66' } : {}} />
        {lastTimeline ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{label}</Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {description}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#50C878' }}>
          {request}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object,
  lastTimeline: PropTypes.bool,
};
