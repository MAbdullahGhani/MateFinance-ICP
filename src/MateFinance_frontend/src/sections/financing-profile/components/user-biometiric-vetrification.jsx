import React from 'react';
import { Typography, Grid, Button, ButtonBase, Card, CardContent } from '@mui/material';
// import { useSelector } from 'react-redux';

function UserBiometricVerification({ financialDetail, openCommentModalHandler }) {
  // const { userAttachments } = useSelector((state) => state.auth);

  const showImageInPop = (images) => {
    window.open(`${userAttachments.url}${images}${userAttachments.token}`);
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
            Biometric Verification Detail
          </Typography>

          {/* {financialDetail.creditScore.biometricVerification?.status !== 'Pending' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                openCommentModalHandler(financialDetail.creditScore.biometricVerification)
              }
            >
              Actions
            </Button>
          )} */}
        </div>

        {financialDetail.creditScore.biometricVerification?.status && (
          <Typography
            variant="h6"
            color="primary"
            component="h3"
            sx={{
              fontWeight: 600,
              textAlign: 'left',
              fontSize: '16px',
              marginTop: '10px',
            }}
          >
            Status: {financialDetail.creditScore.biometricVerification.status}
          </Typography>
        )}
        <Grid container align="center" sx={{ marginTop: '20px' }} justifyContent="space-between">
          <Grid item sm={12} md={12} lg={20}>
            {financialDetail.biometricVerificationDetial ? (
              <figure style={{ position: 'relative' }}>
                <ButtonBase
                  focusRipple
                  sx={{
                    width: '467px',
                    height: '350px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '10px',
                    '&:hover, &$focusVisible': {
                      zIndex: 1,
                      '& $imageBackdrop': {
                        opacity: 0.15,
                      },
                      '& $imageMarked': {
                        opacity: 0,
                      },
                      '& $imageTitle': {
                        border: '4px solid currentColor',
                      },
                    },
                  }}
                  onClick={() => showImageInPop([financialDetail.biometricVerificationDetial])}
                >
                  <img
                    src={`${userAttachments.url}${financialDetail.biometricVerificationDetial}${userAttachments.token}`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      color: 'transparent',
                    }}
                  >
                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="inherit"
                      sx={{
                        position: 'relative',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        borderBottom: '2px solid',
                      }}
                    >
                      Biometric Verification
                    </Typography>
                  </span>
                </ButtonBase>
              </figure>
            ) : (
              <Typography style={{ textAlign: 'center' }}>No Detail Found</Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default UserBiometricVerification;
