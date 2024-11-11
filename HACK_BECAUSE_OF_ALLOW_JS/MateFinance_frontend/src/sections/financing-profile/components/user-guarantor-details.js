import React from 'react';
import { Paper, Typography, Grid, ListItem, ListItemAvatar, ListItemText, Button, Card, CardContent, } from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
function UserGuarantorDetails({ financialDetail, openCommentModalHandler }) {
    return (<Card style={{ padding: '30px', marginTop: '20px' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" color="secondary" component="h3" style={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}>
            Guarantor Details
          </Typography>
          {/* {financialDetail.creditScore.guarantor?.status !== 'Pending' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => openCommentModalHandler(financialDetail.creditScore.guarantor)}
          >
            Actions
          </Button>
        )} */}
        </div>

        {financialDetail?.creditScore?.guarantor?.status && (<Typography variant="h6" color="primary" component="h3" style={{
                fontWeight: 600,
                textAlign: 'left',
                fontSize: '16px',
            }}>
            Status: {financialDetail?.creditScore?.guarantor.status}
          </Typography>)}

        {financialDetail?.guarantorDetails ? (<>
            <Grid container style={{ marginTop: '20px' }}>
              <Grid item sm={12} md={12} lg={12}>
                <Typography style={{
                fontSize: '17px',
                fontWeight: 600,
                textAlign: 'left',
                width: 'fit-content',
            }}>
                  Guarantor 1:
                </Typography>
              </Grid>
              <Grid item sm={12} md={4} lg={3}>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify icon="mingcute:group-fill" width="40px" sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography style={{ fontWeight: '600' }}>Relationship</Typography>} secondary={<Typography style={{ fontWeight: '500' }}>
                        {financialDetail?.guarantorDetails?.guarantor1
                    ? financialDetail?.guarantorDetails?.guarantor1?.relationShip || ''
                    : ''}
                      </Typography>}/>
                </ListItem>
              </Grid>
              <Grid item sm={12} md={4} lg={3}>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify icon="ion:person" width="40px" sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography style={{ fontWeight: '600' }}>Name</Typography>} secondary={<Typography style={{ fontWeight: '500' }}>
                        {financialDetail.guarantorDetails?.guarantor1
                    ? financialDetail.guarantorDetails?.guarantor1?.name || ''
                    : ''}
                      </Typography>}/>
                </ListItem>
              </Grid>
              <Grid item sm={12} md={4} lg={3}>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify icon="icomoon-free:mobile" width="45px" sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography style={{ fontWeight: '600' }}>Mobile Number</Typography>} secondary={<Typography style={{ fontWeight: '500' }}>
                        {financialDetail.guarantorDetails?.guarantor1
                    ? financialDetail.guarantorDetails.guarantor1?.mobileNumber || ''
                    : ''}
                      </Typography>}/>
                </ListItem>
              </Grid>
              <Grid item sm={12} md={4} lg={3}>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify icon="icomoon-free:mobile" width="45px" sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography style={{ fontWeight: '600' }}>CNIC</Typography>} secondary={<Typography style={{ fontWeight: '500' }}>
                        {financialDetail?.guarantorDetails?.guarantor1
                    ? financialDetail?.guarantorDetails?.guarantor1?.cnic || ''
                    : ''}
                      </Typography>}/>
                </ListItem>
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: '20px' }}>
              <Grid item sm={12} md={12} lg={12}>
                <Typography style={{
                fontSize: '17px',
                fontWeight: 600,
                textAlign: 'left',
                width: 'fit-content',
            }}>
                  Guarantor 2:
                </Typography>
              </Grid>
              <Grid item sm={12} md={4} lg={3}>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify icon="mingcute:group-fill" width="40px" sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography style={{ fontWeight: '600' }}>RelationShip</Typography>} secondary={<Typography style={{ fontWeight: '500' }}>
                        {financialDetail?.guarantorDetails?.guarantor2
                    ? financialDetail?.guarantorDetails?.guarantor2?.relationShip || ''
                    : ''}
                      </Typography>}/>
                </ListItem>
              </Grid>
              <Grid item sm={12} md={4} lg={3}>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify icon="ion:person" width="40px" sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography style={{ fontWeight: '600' }}>Name</Typography>} secondary={<Typography style={{ fontWeight: '500' }}>
                        {financialDetail?.guarantorDetails?.guarantor2
                    ? financialDetail?.guarantorDetails?.guarantor2?.name || ''
                    : ''}
                      </Typography>}/>
                </ListItem>
              </Grid>
              <Grid item sm={12} md={4} lg={3}>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify icon="icomoon-free:mobile" width="45px" sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography style={{ fontWeight: '600' }}>Mobile Number</Typography>} secondary={<Typography style={{ fontWeight: '500' }}>
                        {financialDetail?.guarantorDetails?.guarantor2
                    ? financialDetail?.guarantorDetails?.guarantor2?.mobileNumber || ''
                    : ''}
                      </Typography>}/>
                </ListItem>
              </Grid>
              <Grid item sm={12} md={4} lg={3}>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify icon="icomoon-free:mobile" width="45px" sx={{ color: '#5A2C66', fontSize: '42px' }}/>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography style={{ fontWeight: '600' }}>CNIC</Typography>} secondary={<Typography style={{ fontWeight: '500' }}>
                        {financialDetail?.guarantorDetails?.guarantor2
                    ? financialDetail?.guarantorDetails?.guarantor2?.cnic || ''
                    : ''}
                      </Typography>}/>
                </ListItem>
              </Grid>
            </Grid>
          </>) : (<Typography style={{ textAlign: 'center' }}>No Detail Found</Typography>)}
      </CardContent>
    </Card>);
}
export default UserGuarantorDetails;
