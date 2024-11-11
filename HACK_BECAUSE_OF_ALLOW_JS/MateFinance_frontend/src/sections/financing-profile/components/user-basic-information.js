import React from 'react';
import { Paper, Typography, Grid, ListItem, ListItemAvatar, ListItemText, CardContent, Card, } from '@mui/material';
import moment from 'moment';
import Iconify from 'src/components/iconify/iconify';
import { fDate } from 'src/utils/format-time';
const listItemStyle = {
    display: 'flex',
};
const listItemAvatarStyle = {
    justifyContent: 'center',
};
const iconStyle = {
    color: '#5A2C66',
    fontSize: '42px',
};
function UserBasicInformation({ financialDetail, subscriber, creditScoreCriteriaList }) {
    const daysCalculator = (date_1, date_2) => {
        const date1 = new Date(date_1);
        const difference = date_2.getTime() - date1.getTime();
        const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    };
    return (<Card sx={{ p: 3, mt: 1 }}>
      <CardContent>
        <Typography variant="h5" color="secondary" component="h3" sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}>
          Basic Information
        </Typography>
      </CardContent>
      <Grid container spacing={2}>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="ion:person" sx={iconStyle} width={40}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Name</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>{financialDetail?.fullName || ''}</Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="dashicons:email-alt" sx={iconStyle} width={45}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Email</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {(subscriber && subscriber.email) || ''}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="healthicons:city" sx={iconStyle} width={50}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>City</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {(subscriber && subscriber.businessInfo?.city) || ''}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="radix-icons:id-card" sx={iconStyle} width={50}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>CNIC</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {financialDetail?.cnicNumber || ''}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="fluent-mdl2:date-time-12" sx={iconStyle} width={45}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Active</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {financialDetail?.active ? financialDetail?.active : ''}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="clarity:date-solid" sx={iconStyle} width={43}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Req. For Financing</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {financialDetail?.joiningDate
                ? moment(financialDetail?.joiningDate).format('DD-MM-YYYY')
                : ''}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="ion:person" sx={iconStyle} width={40}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Father Name</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {financialDetail?.fatherName ? financialDetail?.fatherName : ''}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="clarity:date-solid" sx={iconStyle} width={43}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Date of birth</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {financialDetail?.DateOfBirth
                ? moment(financialDetail?.DateOfBirth).format('DD-MM-YYYY')
                : ''}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="clarity:date-solid" sx={iconStyle} width={43}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>SignUp Date</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {subscriber.joiningDate
                ? moment(subscriber.joiningDate).format('DD-MM-YYYY')
                : ''}
                  (
                  {subscriber.joiningDate ? daysCalculator(subscriber.joiningDate, new Date()) : ''}
                  )
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="fluent:receipt-24-filled" sx={iconStyle} width={45}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>No of Invoices</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {subscriber.invoiceCount ? subscriber.invoiceCount : 0}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="icomoon-free:mobile" sx={iconStyle} width={45}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Mobile #</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {subscriber.mobileNumber ? subscriber.mobileNumber : ''}
                </Typography>}/>
          </ListItem>
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="solar:home-bold" sx={iconStyle} width={45}/>
            </ListItemAvatar>
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Home Address</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>
                  {financialDetail?.homeAddress ? financialDetail?.homeAddress : ''}
                </Typography>}/>
          </ListItem>
        </Grid>
      </Grid>
    </Card>);
}
export default UserBasicInformation;
