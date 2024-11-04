import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
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

function HoldingCompanyDetails({ financialDetail, userId }) {
  const [currentHash, setCurrentHash] = useState('');
  const [blockchainHash, setBlockchainHash] = useState('');

  return (
    <>
      <Card sx={{ p: 3, mt: 1 }}>
        <CardContent>
          <Typography
            variant="h5"
            color="secondary"
            component="h3"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 750,
              textAlign: 'left',
              width: '100%',
            }}
          >
            Business Information{' '}
            <Box className="animate_animated animatefadeIn animate_repeat-3">
              {currentHash === blockchainHash ? (
                <Tooltip title="Blockchain Valid">
                  <Iconify icon="solar:shield-check-bold-duotone" color="green" width={30} />
                </Tooltip>
              ) : (
                <Tooltip title="Blockchain Invalid">
                  <Iconify icon="solar:shield-cross-bold-duotone" color="red" width={30} />
                </Tooltip>
              )}
            </Box>
          </Typography>
          <Typography
            sx={{
              fontWeight: 750,
              textAlign: 'left',
              width: '75',
            }}
            color="primary"
          >
            Status : {financialDetail.status}
          </Typography>
        </CardContent>
        <Grid container spacing={2}>
          {/* Organization Type */}
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="mdi:domain" sx={iconStyle} width={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Organization Type</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {financialDetail?.userFinance?.businessInfo?.organizationType || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          {/* Organization Type Change by Admin */}

          {/* Business Activity */}
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify
                  icon="material-symbols:business-center-outline"
                  sx={iconStyle}
                  width={40}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Business Activity</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {financialDetail?.userFinance?.businessInfo?.businessActivity || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          {/* Business Name */}
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="mdi:office-building" sx={iconStyle} width={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Business Name</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {financialDetail?.userFinance?.businessInfo?.businessName || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          {/* Registered Address */}
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="healthicons:city" sx={iconStyle} width={50} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Registered Address</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {financialDetail?.userFinance?.businessInfo?.registeredAddress || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          {/* VAT Number */}
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="heroicons-solid:receipt-tax" sx={iconStyle} width={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>VAT Number</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {financialDetail?.userFinance?.businessInfo?.vatNumber || ''}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          <Grid item sm={12} md={4} lg={4}>
            <ListItem>
              <ListItemAvatar>
                <Iconify
                  icon="mdi:business-outline"
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
                    {financialDetail?.userFinance?.businessInfo?.b2Type || ''}
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
                    {financialDetail?.userFinance?.businessInfo?.lendingPartner?.name || '-'}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          {/* Website */}
          <Grid item sm={12} md={4} lg={4}>
            <ListItem sx={listItemStyle}>
              <ListItemAvatar sx={listItemAvatarStyle}>
                <Iconify icon="fluent-mdl2:website" sx={iconStyle} width={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600 }}>Website</Typography>}
                secondary={
                  <Typography sx={{ fontWeight: 500, textOverflow: 'ellipsis' }}>
                    <a
                      href={financialDetail?.userFinance?.businessInfo?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        </Grid>
      </Card>

      {/* Holding Company Details */}
      {financialDetail?.holdingCompanyDetails?.companyName ||
        (financialDetail?.holdingCompanyDetails?.businessActivity && (
          <Card sx={{ p: 3, mt: 1 }}>
            <CardContent>
              <Typography
                variant="h5"
                color="secondary"
                component="h3"
                sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}
              >
                Holding Company Details
              </Typography>
            </CardContent>
            <Grid container spacing={2}>
              {financialDetail?.holdingCompanyDetails?.companyName === '' ? (
                ''
              ) : (
                <Grid item sm={12} md={4} lg={4}>
                  <ListItem sx={listItemStyle}>
                    <ListItemAvatar sx={listItemAvatarStyle}>
                      <Iconify icon="mdi:company" sx={iconStyle} width={45} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600 }}>Company Name</Typography>}
                      secondary={
                        <Typography sx={{ fontWeight: 500 }}>
                          {financialDetail?.holdingCompanyDetails?.companyName || ''}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grid>
              )}
              {financialDetail?.holdingCompanyDetails?.businessActivity === '' ? (
                ''
              ) : (
                <Grid item sm={12} md={4} lg={4}>
                  <ListItem sx={listItemStyle}>
                    <ListItemAvatar sx={listItemAvatarStyle}>
                      <Iconify
                        icon="material-symbols:business-center-outline"
                        sx={iconStyle}
                        width={40}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600 }}>Business Activity</Typography>}
                      secondary={
                        <Typography sx={{ fontWeight: 500 }}>
                          {financialDetail?.holdingCompanyDetails?.businessActivity || ''}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grid>
              )}
              {financialDetail?.holdingCompanyDetails?.registeredAddress === '' ? (
                ''
              ) : (
                <Grid item sm={12} md={4} lg={4}>
                  <ListItem sx={listItemStyle}>
                    <ListItemAvatar sx={listItemAvatarStyle}>
                      <Iconify icon="healthicons:city" sx={iconStyle} width={50} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600 }}>Registered Address</Typography>}
                      secondary={
                        <Typography sx={{ fontWeight: 500 }}>
                          {financialDetail?.holdingCompanyDetails?.registeredAddress || ''}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grid>
              )}

              {financialDetail?.holdingCompanyDetails?.tradingName === '' ? (
                ''
              ) : (
                <Grid item sm={12} md={4} lg={4}>
                  <ListItem sx={listItemStyle}>
                    <ListItemAvatar sx={listItemAvatarStyle}>
                      <Iconify icon="game-icons:trade" sx={iconStyle} width={43} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600 }}>Trading Name</Typography>}
                      secondary={
                        <Typography sx={{ fontWeight: 500 }}>
                          {financialDetail?.holdingCompanyDetails?.tradingName || ''}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grid>
              )}
              {financialDetail?.holdingCompanyDetails?.website === '' ? (
                ''
              ) : (
                <Grid item sm={12} md={4} lg={4}>
                  <ListItem sx={listItemStyle}>
                    <ListItemAvatar sx={listItemAvatarStyle}>
                      <Iconify icon="fluent-mdl2:website" sx={iconStyle} width={40} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600 }}>Website</Typography>}
                      secondary={
                        <Typography sx={{ fontWeight: 500 }}>
                          {financialDetail?.holdingCompanyDetails?.website || ''}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grid>
              )}
            </Grid>
          </Card>
        ))}
    </>
  );
}

export default HoldingCompanyDetails;
