import React from 'react';
import { Paper, Typography, Grid, Box, Card, CardContent } from '@mui/material';
// import PaymentChannelCardItem from 'src/sections/auth/user/components/card/payment-channel-card-item';
import Scrollbar from 'src/components/scrollbar';

function UserAccountInformation({ financialDetail }) {
  return (
    <Card sx={{ p: 3, mt: 2 }}>
      <CardContent>
        <Typography
          variant="h5"
          color="secondary"
          component="h3"
          sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}
        >
          Account
        </Typography>
        {/* <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box sx={{ height: 200, width: '100%' }}>
              <Scrollbar>
                <Box
                  rowGap={2.5}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}
                  // sx={{ p: 3 }}
                >
                  {financialDetail?.jazzCash &&
                    financialDetail?.jazzCash?.map((item) => {
                      return (
                        <PaymentChannelCardItem
                          paymentChannelLogo="/logo/jazz-cash-logo.png"
                          key={item?.accountNumber}
                          card={{
                            index: item?.accountNumber,
                            id: item?.accountNumber,
                            cardNumber: item?.accountNumber,
                            cardName: item?.accountName,
                            accountType: 'JazzCash',
                            cardType: 'jazzCash',
                            primary: true,
                          }}
                        />
                      );
                    })}
                  {financialDetail?.payPal &&
                    financialDetail?.payPal?.map((item) => {
                      return (
                        <PaymentChannelCardItem
                          key={item?.accountNumber}
                          paymentChannelLogo="/logo/paypal-logo.png"
                          card={{
                            index: item?.accountNumber,
                            id: item?.accountNumber,
                            cardNumber: item?.accountNumber,
                            cardName: item?.accountTitle || item?.accountName, // after edit  store changes accountTitle into accountName
                            accountType: 'Paypal',
                            cardType: 'paypal',
                            primary: true,
                          }}
                        />
                      );
                    })}
                  {financialDetail?.easyPaisa &&
                    financialDetail?.easyPaisa?.map((item) => {
                      return (
                        <PaymentChannelCardItem
                          key={item?.accountNumber}
                          paymentChannelLogo="/logo/easypaisa-logo.png"
                          card={{
                            index: item?.accountNumber,
                            id: item?.accountNumber,
                            cardNumber: item?.accountNumber,
                            cardName: item?.accountName,
                            accountType: 'Easypaisa',
                            cardType: 'easyPaisa',
                            primary: true,
                          }}
                        />
                      );
                    })}
                  {financialDetail?.raast &&
                    financialDetail?.raast?.map((item) => {
                      return (
                        <PaymentChannelCardItem
                          key={item?.accountNumber}
                          paymentChannelLogo="/logo/raast-logo.png"
                          card={{
                            index: item?.accountNumber,
                            id: item?.accountNumber,
                            cardNumber: item?.accountNumber,
                            cardName: item?.accountName,
                            accountType: 'RAAST',
                            cardType: 'raast',
                            primary: true,
                          }}
                        />
                      );
                    })}
                  {financialDetail?.payoneer &&
                    financialDetail?.payoneer?.map((item) => {
                      return (
                        <PaymentChannelCardItem
                          key={item?.accountNumber}
                          paymentChannelLogo="/logo/payoneer-logo.png"
                          card={{
                            index: item?.accountNumber,
                            id: item?.accountNumber,
                            cardNumber: item?.accountNumber,
                            cardName: item?.accountTitle,
                            accountType: 'Payoneer',
                            cardType: 'payoneer',
                            primary: true,
                          }}
                        />
                      );
                    })}
                  {financialDetail?.bankAccounts &&
                    financialDetail?.bankAccounts?.map((item) => {
                      return (
                        <PaymentChannelCardItem
                          key={item?.accountNumber}
                          paymentChannelLogo="/logo/bank-transfer-logo.png"
                          card={{
                            index: item?.accountNumber,
                            id: item?.accountNumber,
                            cardNumber: item?.accountNumber,
                            cardName: item?.bankName,
                            accountType: 'Bank Transfer',
                            cardType: 'bankAccounts',
                            primary: true,
                          }}
                        />
                      );
                    })}
                </Box>
              </Scrollbar>
            </Box>
          </Grid>
        </Grid> */}
      </CardContent>
    </Card>
  );
}

export default UserAccountInformation;
