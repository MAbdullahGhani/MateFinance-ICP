import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
const FinanceStatus = ({ status }) => {
    const statusFun = (finaceStatus) => {
        const status = finaceStatus ? finaceStatus.toLowerCase() : '';
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'in progress':
                return 'in Progress';
            case 'need more details':
                return 'Correction Required';
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return '';
        }
    };
    return (<Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            p: 2,
            textAlign: 'center',
        }}>
      <Typography variant="h5">{statusFun(status)}</Typography>
    </Box>);
};
export default FinanceStatus;
