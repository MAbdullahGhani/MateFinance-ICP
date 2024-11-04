import React from 'react';
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

const CompanyFeaturesCards = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* First column */}
        <Grid item xs={12} md={12} lg={6}>
          {/* Card 1 */}
          <Card
            sx={{
              // height: '50%',
              // height: 700,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                height: '100%',
                // width: 830,
                mx: 'auto',
              }}
            >
              <img src="/assets/background/Diversification.png" alt="Backer 2" />
            </Box>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#667085', fontWeight: 600, py: 2 }}>
                Diversification
              </Typography>
              <Typography variant="body1" sx={{ color: '#667085' }}>
                Sustainable and attractive Yields from a proven revenue model with low volatility
                backed by REAL Trade Receivables.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Second column */}
        <Grid item xs={12} md={12} lg={6}>
          {/* Card 2 */}
          <Card
            sx={{
              // height: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                height: 253,
                width: 348,
                mx: 'auto',
              }}
            >
              <img src="/assets/background/Diversification Icon 2.png" alt="Backer 2" />
            </Box>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#667085', fontWeight: 600 }}>
                Transparency
              </Typography>
              <Typography variant="body1" sx={{ color: '#667085' }}>
                Tokenizing every step of the Invoicing journey through InvoiceMate (Invoice
                Management System) ensuring transparency and credibility.
              </Typography>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card
            sx={{
              // height: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              mt: 2,
            }}
          >
            <Box
              sx={{
                height: 253,
                width: 348,
                mx: 'auto',
              }}
            >
              <img src="/assets/background/Diversification Icon 3.png" alt="Backer 2" />
            </Box>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#667085', fontWeight: 600 }}>
                Growth
              </Typography>
              <Typography variant="body1" sx={{ color: '#667085' }}>
                Diversification of Portfolio by gaining exposure to Short Term Risk Scored Loan
                Prepositions backed by Real World Assets (Invoices).
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* RISK MITIGATION */}
      <Card sx={{ mt: 3, display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
        <CardMedia
          component="img"
          height={{ xs: 300, lg: '100%' }}
          image="/assets/background/Risk Mitigation Icon 1.png"
          alt="Risk Mitigation"
          sx={{ flex: { xs: '0 0 100%', lg: '0 0 345px' } }}
        />
        <CardContent
          sx={{
            flex: '1 1 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.80)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: 3,
            pt: { xs: 2, lg: 0 }, // Adjust top padding for smaller screens
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#040815',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 600,
              lineHeight: '54px',
              wordWrap: 'break-word',
              mt: { xs: 2, lg: 1 }, // Adjust top margin for smaller screens
              textAlign: 'center', // Center align text on all screens
            }}
          >
            Risk Mitigation
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#596780',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 400,
              lineHeight: '24px',
              wordWrap: 'break-word',
              mt: 1,
              textAlign: 'center', // Center align text on all screens
            }}
          >
            Powering only Verifiable Real World Assets (Invoices) with Accurate Credentials and
            Business Activities through our Know Your Invoice (KYI) Service.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyFeaturesCards;
