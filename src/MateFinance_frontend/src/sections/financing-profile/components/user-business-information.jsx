import React from 'react';
import {
  Typography,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Card,
  CardContent,
} from '@mui/material';

import Iconify from 'src/components/iconify/iconify';

const UserBusinessInformation = ({
  financialDetail,
  openCommentModalHandler,
  userDetail,
  creditScoreCriteriaList,
}) => {
  return (
    <Card sx={{ padding: '30px', marginTop: '20px' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            color="secondary"
            component="h3"
            sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}
          >
            Business Information
          </Typography>
          {/* {financialDetail.creditScore.basicInfo?.status !== 'Pending' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => openCommentModalHandler(creditScoreCriteriaList?.basicInfo)}
              >
                Actions
              </Button>
            )} */}
        </div>
        {financialDetail?.creditScore?.basicInfo?.status && (
          <Typography
            variant="h6"
            color="primary"
            component="h3"
            sx={{ fontWeight: 600, textAlign: 'left', fontSize: '16px' }}
          >
            Status: {financialDetail?.creditScore?.basicInfo.status}
          </Typography>
        )}
        <Grid container>
          <Grid item sm={12} md={4} lg={4}>
            <ListItem>
              <ListItemAvatar>
                <Iconify
                  icon="ion:business"
                  width={40}
                  sx={{
                    color: '#5A2C66',
                    fontSize: '42px',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: '600' }}>Business Name</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: '500' }}>
                    {financialDetail?.businessName || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          <Grid item sm={12} md={4} lg={4}>
            <ListItem>
              <ListItemAvatar>
                <Iconify
                  icon="tabler:briefcase-filled"
                  width={43}
                  sx={{
                    color: '#5A2C66',
                    fontSize: '42px',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: '600' }}>Business Type</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: '500' }}>
                    {financialDetail?.businessType || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          <Grid item sm={12} md={4} lg={4}>
            <ListItem>
              <ListItemAvatar>
                <Iconify
                  icon="octicon:organization-16"
                  width={43}
                  sx={{
                    color: '#5A2C66',
                    fontSize: '42px',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: '600' }}>Organization Type</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: '500' }}>
                    {userDetail?.organizationType || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          <Grid item sm={12} md={4} lg={4}>
            <ListItem>
              <ListItemAvatar>
                <Iconify
                  icon="clarity:date-solid"
                  width={43}
                  sx={{
                    color: '#5A2C66',
                    fontSize: '42px',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: '600' }}>Monthly Turnover</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: '500' }}>
                    {financialDetail?.monthlyTurnover || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          <Grid item sm={12} md={4} lg={4}>
            <ListItem>
              <ListItemAvatar>
                <Iconify
                  icon="ic:round-confirmation-number"
                  width={43}
                  sx={{
                    color: '#5A2C66',
                    fontSize: '42px',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: '600' }}>NTN</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: '500' }}>{financialDetail?.ntn || ''}</Typography>
                }
              />
            </ListItem>
          </Grid>
          <Grid item sm={12} md={4} lg={4}>
            <ListItem>
              <ListItemAvatar>
                <Iconify
                  icon="mdi:shop-location"
                  width={43}
                  sx={{
                    color: '#5A2C66',
                    fontSize: '42px',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: '600' }}>Business Address</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: '500' }}>
                    {financialDetail?.businessAddress || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          <Grid item sm={12} md={4} lg={4}>
            <ListItem>
              <ListItemAvatar>
                <Iconify
                  icon="fluent:building-bank-toolbox-24-filled"
                  width={43}
                  sx={{
                    color: '#5A2C66',
                    fontSize: '50px',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: '600' }}>Lending Partner</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: '500' }}>
                    {userDetail?.userFinance?.lendingPartner || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserBusinessInformation;
