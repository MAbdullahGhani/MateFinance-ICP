import React from 'react';
import { Typography, Grid, ButtonBase, CardContent, Card } from '@mui/material';
import { IM_ATTACHMENT_TOKEN, IM_ATTACHMENT_URL } from 'src/config-global';
// import { useSelector } from 'react-redux';
const UserCnicInformation = ({ financialDetail }) => {
    // const { userAttachments } = useSelector((state) => state.auth);
    const downloadImage = (imageUrl) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        // link.download = 'cnic_image.jpg'; // You can set the desired file name here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (<Card sx={{ p: '30px', mt: '35px' }}>
      <CardContent>
        <Typography variant="h5" color="secondary" component="h3" sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}>
          CNIC
        </Typography>
        <Grid container sx={{ marginTop: '20px' }} justifyContent="space-between">
          <Grid item sm={12} md={6} lg={5}>
            <figure>
              <ButtonBase focusRipple sx={{ display: 'block', maxWidth: '200%' }} onClick={() => downloadImage(financialDetail?.cnicFrontImage?.includes('invoicemate.blob')
            ? financialDetail?.cnicFrontImage
            : `${IM_ATTACHMENT_URL}${financialDetail?.cnicFrontImage}${IM_ATTACHMENT_TOKEN}` ||
                undefined)}>
                <img src={financialDetail?.cnicFrontImage?.includes('invoicemate.blob')
            ? financialDetail?.cnicFrontImage
            : `${IM_ATTACHMENT_URL}${financialDetail?.cnicFrontImage}${IM_ATTACHMENT_TOKEN}` ||
                undefined} alt="" style={{ maxHeight: '350px' }}/>
                <span />
                <div>
                  <Typography component="span" variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                    Front Side
                    <span />
                  </Typography>
                </div>
              </ButtonBase>
            </figure>
          </Grid>

          <Grid item sm={12} md={6} lg={5}>
            <figure>
              <ButtonBase focusRipple sx={{ display: 'block', maxWidth: '200%' }} onClick={() => downloadImage(financialDetail?.cnicBackImage?.includes('invoicemate.blob')
            ? financialDetail?.cnicBackImage
            : `${IM_ATTACHMENT_URL}${financialDetail?.cnicBackImage}${IM_ATTACHMENT_TOKEN}` ||
                undefined)}>
                <img src={financialDetail?.cnicBackImage?.includes('invoicemate.blob')
            ? financialDetail?.cnicBackImage
            : `${IM_ATTACHMENT_URL}${financialDetail?.cnicBackImage}${IM_ATTACHMENT_TOKEN}` ||
                undefined} alt="" style={{ maxHeight: '350px' }}/>
                <span />
                <div>
                  <Typography component="span" variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Back Side
                    <span />
                  </Typography>
                </div>
              </ButtonBase>
            </figure>
          </Grid>
        </Grid>
      </CardContent>
    </Card>);
};
export default UserCnicInformation;
