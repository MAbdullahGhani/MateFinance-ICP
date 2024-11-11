import React from 'react';
import { Paper, Typography, Grid, ListItem, ListItemAvatar, ListItemText, CardContent, Card, } from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
const UserContactInformation = ({ financialDetail }) => {
    return (<Card sx={{ p: 3, mt: 2 }}>
        <CardContent>
          <Typography variant="h5" color="secondary" component="h3" sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}>
            Contacts
          </Typography>
          <Grid container sx={{ mt: 2 }}>
            <Grid item sm={12} md={12} lg={12}>
              <Typography color="primary" sx={{ fontSize: '17px', fontWeight: 600, textAlign: 'left', width: 'fit-content' }}>
                Emergency Contact 1:
              </Typography>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <ListItem>
                <ListItemAvatar>
                  <Iconify icon="mingcute:group-fill" width={40} sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                </ListItemAvatar>
                <ListItemText primary={<Typography sx={{ fontWeight: '600' }}>Relationship</Typography>} secondary={<Typography sx={{ fontWeight: '500' }}>
                      {financialDetail.emergencyContact1?.relationShip || ''}
                    </Typography>}/>
              </ListItem>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <ListItem>
                <ListItemAvatar>
                  <Iconify icon="ion:person" width={40} sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                </ListItemAvatar>
                <ListItemText primary={<Typography sx={{ fontWeight: '600' }}>Name</Typography>} secondary={<Typography sx={{ fontWeight: '500' }}>
                      {financialDetail.emergencyContact1?.name || ''}
                    </Typography>}/>
              </ListItem>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <ListItem>
                <ListItemAvatar>
                  <Iconify icon="icomoon-free:mobile" width={45} sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                </ListItemAvatar>
                <ListItemText primary={<Typography sx={{ fontWeight: '600' }}>Mobile Number</Typography>} secondary={<Typography sx={{ fontWeight: '500' }}>
                      {financialDetail.emergencyContact1?.mobileNumber || ''}
                    </Typography>}/>
              </ListItem>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 2 }}>
            <Grid item sm={12} md={12} lg={12}>
              <Typography color="primary" sx={{ fontSize: '17px', fontWeight: 600, textAlign: 'left', width: 'fit-content' }}>
                Emergency Contact 2:
              </Typography>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <ListItem>
                <ListItemAvatar>
                <Iconify icon="mingcute:group-fill" width={40} sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                </ListItemAvatar>
                <ListItemText primary={<Typography sx={{ fontWeight: '600' }}>Relationship</Typography>} secondary={<Typography sx={{ fontWeight: '500' }}>
                      {financialDetail.emergencyContact2?.relationShip || ''}
                    </Typography>}/>
              </ListItem>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <ListItem>
                <ListItemAvatar>
                <Iconify icon="ion:person" width={40} sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                </ListItemAvatar>
                <ListItemText primary={<Typography sx={{ fontWeight: '600' }}>Name</Typography>} secondary={<Typography sx={{ fontWeight: '500' }}>
                      {financialDetail.emergencyContact2?.name || ''}
                    </Typography>}/>
              </ListItem>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <ListItem>
                <ListItemAvatar>
                <Iconify icon="icomoon-free:mobile" width={45} sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                </ListItemAvatar>
                <ListItemText primary={<Typography sx={{ fontWeight: '600' }}>Mobile Number</Typography>} secondary={<Typography sx={{ fontWeight: '500' }}>
                      {financialDetail.emergencyContact2?.mobileNumber || ''}
                    </Typography>}/>
              </ListItem>
            </Grid>
          </Grid>
        </CardContent>
      </Card>);
};
export default UserContactInformation;
