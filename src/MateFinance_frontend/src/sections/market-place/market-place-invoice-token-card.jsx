import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Divider, Grid } from '@mui/material';
import { formatCurrency } from 'src/utils/format-number';

function InvoiceTokenCard({ deal }) {
  function calculateExpiryDate(creationDateStr, daysUntilExpiry) {
    if ((creationDateStr, daysUntilExpiry)) {
      // Parse the creation date string into a Date object
      const creationDate = new Date(creationDateStr);
      const daysNumber = parseInt(daysUntilExpiry.split(' ')[0]);
      // Add the specified number of days to the creation date
      const expiryDate = new Date(creationDate);
      expiryDate.setDate(expiryDate.getDate() + daysNumber);

      // Calculate the difference in days from today
      const today = new Date();
      const timeDiff = expiryDate - today;
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      // Output the expiry date and the difference in days
      // console.log("Expiry Date: " + expiryDate.toISOString());
      return diffDays;
    }
  }
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        padding: 3,
        background: 'linear-gradient(0deg, white 0%, white 100%)',
        borderRadius: 2,
        backgroundImage: 'url(/assets/background/invoice-token-card.jpg)',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      <Box
        sx={{
          alignSelf: 'stretch',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Overview
          </Typography>
          <Box
            sx={{
              alignSelf: 'stretch',
              height: 86,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              Loan Amount
            </Typography>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 600 }}>
              {/* {formatCurrency(deal?.overview?.loanAmount)} */}
              {deal?.overview?.chain === 'Haqq Network' ? 'axlUSDC' : 'USDC'}{' '}
              {deal?.overview?.loanAmount}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            position: 'absolute',
            zIndex: 100,
            right: '35px',
            top: '5px',
          }}
        >
          <img
            style={{ border: '2px solid white', borderRadius: '10px' }}
            src={
              deal?.isFirozaAPI
                ? '/assets/firoza.png'
                : deal?.overview?.chain === 'Arbitrum Network'
                  ? '/assets/arbitrum.png'
                  : '/assets/haqq.png'
            }
          />
        </Box>
        <CardMedia
          component="img"
          image="/logo/Rectangle-logo.png"
          alt="Placeholder"
          sx={{
            width: 100,
            // height: 100,
            // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
            borderRadius: 2,
          }}
        />
      </Box>
      <Divider
        sx={{
          alignSelf: 'stretch',
          borderColor: 'rgba(255, 255, 255, 0.20)',
          borderWidth: '1.4px',
        }}
      />
      <Typography variant="h6" sx={{ alignSelf: 'stretch', color: 'white', fontWeight: 600 }}>
        {deal?.overview?.loanSummary}
      </Typography>
      <Box
        sx={{
          padding: 2,
          background: 'rgba(0, 0, 0, 0.40)',
          borderRadius: 2,
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  APY Rate
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {deal?.overview?.apyRate}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  KYI Score
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {deal?.kyiScore || '-'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Blockchain Network
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {deal?.overview?.chain}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Minimum Financing Amt.
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {formatCurrency(deal?.overview?.minimumFinancingAmt)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Maximum Financing Amt.
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {formatCurrency(deal?.overview?.maximumFinancingAmt)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Early Withdraw Fee
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {formatCurrency(deal?.overview?.earlyWithdrawFee) || 'N.A.'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {deal?.status === 'lending' ? 'Repayment Due In' : 'Deal Expires In'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {deal?.status.toLowerCase() === 'repayment'
                    ? '-'
                    : deal?.status === 'lending'
                      ? calculateExpiryDate(deal?.lending?.statusDate, deal?.overview?.loanTenure) +
                        ' ' +
                        'Days'
                      : calculateExpiryDate(deal?.createdAt, deal?.overview?.dealExpiresIn) +
                        ' ' +
                        'Days'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Loan Tenure
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {deal?.overview?.loanTenure}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} lg={4}>
            <Box
              sx={{
                height: 79,
                paddingY: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Settlement Cycle
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {deal?.overview?.settlementCycle}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

export default InvoiceTokenCard;
