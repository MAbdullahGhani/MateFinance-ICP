import React from 'react';
import { Paper, Typography, Grid, ListItem, ListItemAvatar, ListItemText, CardContent, Card, } from '@mui/material';
import moment from 'moment';
import Iconify from 'src/components/iconify/iconify';
import { fDate } from 'src/utils/format-time';
import Label from 'src/components/label';
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
function AdvanceKYC({ financialDetail }) {
    return (<Card sx={{ p: 3, marginTop: 6 }}>
      <CardContent>
        <Typography variant="h5" color="secondary" component="h3" sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}>
          Advance KYC
        </Typography>
      </CardContent>
      <Grid container spacing={2}>
        {/* Mapping through advanceKyc array */}
        {financialDetail.advanceKyc.map((item, index) => (<>
            <Grid item key={index} sm={12} md={4} lg={4}>
              <ListItem sx={listItemStyle}>
                <ListItemAvatar sx={listItemAvatarStyle}>
                  <Iconify icon="fluent:building-bank-toolbox-24-filled" sx={iconStyle} width={40}/>
                </ListItemAvatar>
                {/* Displaying lending partner and status for each item */}
                <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Lending Partner</Typography>} secondary={<Typography sx={{ fontWeight: 500 }}>{item.lendingPartner || ''}</Typography>}/>
              </ListItem>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <ListItem sx={listItemStyle}>
                <ListItemAvatar sx={listItemAvatarStyle}>
                  <Iconify icon="majesticons:chat-status" sx={iconStyle} width={45}/>
                </ListItemAvatar>
                <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Status</Typography>} secondary={<Label sx={{ fontWeight: 500 }}>
                      {item.event_data?.status || ''}
                    </Label>}/>
              </ListItem>
            </Grid>
          </>))}
      </Grid>
    </Card>);
}
export default AdvanceKYC;
