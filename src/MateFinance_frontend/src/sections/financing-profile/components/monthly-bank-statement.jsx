import React from 'react';
import { Typography, Grid, Card, CardHeader, CardContent, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
// import { useSelector } from 'react-redux';

function UserMonthlyBankStatement({ financialDetail }) {
  // const { userAttachments } = useSelector((state) => state.auth);

  const handleShowBankStatement = (file) => {
    window.open(`${userAttachments.url}${file}${userAttachments.token}`);
    console.log(`${userAttachments.url}${file}${userAttachments.token}`);
  };

  return (
    <Card sx={{ p: 3, marginTop: 3 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            color="secondary"
            component="h3"
            sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}
          >
            Monthly Bank Statement
          </Typography>
        </div>

        <Grid container sx={{ marginTop: 3 }} justifyContent="space-between">
          <Grid item sm={12} md={6} lg={6}>
            <Card
              sx={{
                margin: '30px 10px 10px 10px',
                boxShadow: '5px 5px 5px 10px #eef0e9',
                '& .MuiCardHeader-root': {
                  display: 'flex',
                  alignItems: 'center', // Align items vertically in the header
                  justifyContent: 'space-between', // Spread elements horizontally
                  width: '100%', // Ensure the header takes full width
                  fontSize: '17px',
                  fontWeight: 600,
                  '&:hover': {
                    cursor: 'pointer',
                  },
                },
                '& .MuiCardContent-root': {
                  padding: '6px',
                  float: 'right',
                },
              }}
            >
              <CardHeader
                title={
                  <Typography
                    onClick={() =>
                      handleShowBankStatement(financialDetail?.monthBankStatement || '')
                    }
                  >
                    {financialDetail?.monthBankStatement
                      ? 'View Bank Statement'
                      : 'Bank Statement not found'}{' '}
                  </Typography>
                }
                subheader=""
              />
              <CardContent>
                {financialDetail?.monthBankStatement && (
                  <IconButton
                    onClick={() =>
                      handleShowBankStatement(financialDetail?.monthBankStatement || '')
                    }
                  >
                    <Iconify icon="material-symbols:visibility" color="primary" fontSize="small" />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default UserMonthlyBankStatement;
