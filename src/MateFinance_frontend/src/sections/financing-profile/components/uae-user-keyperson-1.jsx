import {
  Card,
  CardContent,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import moment from 'moment';
import React from 'react';
import Iconify from 'src/components/iconify/iconify';

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

function UAEUserKeypersonOne({ user }) {
  //   const daysCalculator = (date_1, date_2) => {
  //     const date1 = new Date(date_1);
  //     const difference = date_2.getTime() - date1.getTime();
  //     const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  //     return TotalDays;
  //   };

  return (
    <Card sx={{ p: 3, mt: 1 }}>
      <CardContent>
        <Typography
          variant="h5"
          color="secondary"
          component="h3"
          sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}
        >
          Key Person 1
        </Typography>
      </CardContent>
      <Grid container spacing={2}>
        {user?.userFinance?.keyPerson1?.fullName === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="ion:person" sx={iconStyle} width={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Name</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1?.fullName || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}
        {user?.userFinance?.keyPerson1?.workEmail === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="dashicons:email-alt" sx={iconStyle} width={45} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Email</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1?.workEmail || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}
        {user?.userFinance?.keyPerson1?.nationality === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="healthicons:city" sx={iconStyle} width={50} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Nationality</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {(user?.userFinance?.keyPerson1 &&
                      user?.userFinance?.keyPerson1?.nationality) ||
                      ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}

        {user?.userFinance?.keyPerson1?.dateOfBirth === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="emojione-monotone:birthday-cake" sx={iconStyle} width={43} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Date of Birth</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1
                      ? moment(user?.userFinance?.keyPerson1?.dateOfBirth).format('DD-MM-YYYY')
                      : ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}
        {user?.userFinance?.keyPerson1?.gender === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="ph:gender-intersex-bold" sx={iconStyle} width={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Gender</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1?.gender || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}

        {user?.userFinance?.keyPerson1?.mobileNumber === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="icomoon-free:mobile" sx={iconStyle} width={45} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Mobile #</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1?.mobileNumber || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}
        {user?.userFinance?.keyPerson1?.uaeResidentialAddress === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="solar:home-bold" sx={iconStyle} width={45} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Residential Address</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1?.uaeResidentialAddress || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}
        {user?.userFinance?.keyPerson1?.seniorOfficialDetails?.designation === null ||
        user?.userFinance?.keyPerson1?.seniorOfficialDetails?.designation === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="gis:position-man" sx={iconStyle} width={50} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Designation</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1?.seniorOfficialDetails?.designation || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}

        {user?.userFinance?.keyPerson1?.seniorOfficialDetails?.organizationName === null ||
        user?.userFinance?.keyPerson1?.seniorOfficialDetails?.organizationName === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="codicon:organization" sx={iconStyle} width={45} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Organization Name</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1?.seniorOfficialDetails?.organizationName || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}

        {user?.userFinance?.keyPerson1?.seniorOfficialDetails?.timeInPositionOrRetired === null ||
        user?.userFinance?.keyPerson1?.seniorOfficialDetails?.timeInPositionOrRetired === '' ? (
          ''
        ) : (
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="tabler:http-post" sx={iconStyle} width={43} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Position Or Retired</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {user?.userFinance?.keyPerson1?.seniorOfficialDetails
                      ?.timeInPositionOrRetired || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}
        {/* <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="clarity:date-solid" sx={iconStyle} width={43} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 600 }}>SignUp Date</Typography>}
              secondary={
                <Typography sx={{ fontWeight: 500 }}>
                  {user.joiningDate ? moment(user.joiningDate).format('DD-MM-YYYY') : ''}(
                  {user.joiningDate ? daysCalculator(user.joiningDate, new Date()) : ''})
                </Typography>
              }
            />
          </ListItem>
        </Grid> */}
        {/* <Grid item sm={12} md={4} lg={4}>
          <ListItem sx={listItemStyle}>
            <ListItemAvatar sx={listItemAvatarStyle}>
              <Iconify icon="fluent:receipt-24-filled" sx={iconStyle} width={45} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 600 }}>No of Invoices</Typography>}
              secondary={
                <Typography sx={{ fontWeight: 500 }}>
                  {user.invoiceCount ? user.invoiceCount : 0}
                </Typography>
              }
            />
          </ListItem>
        </Grid> */}
      </Grid>
    </Card>
  );
}

export default UAEUserKeypersonOne;
