import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
import {
  ATTACHMENT_TOKEN,
  ATTACHMENT_URL,
  IM_HOST_ARB_EXPLORER,
  IM_HOST_EXPLORER,
  SMART_CON_URL,
} from 'src/config-global';
import { Grid, List, ListItem, ListItemAvatar, Paper, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TableNoData } from 'src/components/table';
import axios, { endpoints } from 'src/utils/axios';
import { useEffect, useState } from 'react';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import { useSnackbar } from 'src/components/snackbar';
import { handleCopy, shortenHash } from 'src/utils/change-case';
import { fDateTime } from 'src/utils/format-time';
import Image from 'src/components/image';
import {
  haqInvoiceMateContractABI,
  haqInvoiceMateContractAddress,
  haqJsonURL,
  haqqChainId,
  haqWalletPrivateKey,
} from 'src/haqchain-config';
import { ethers } from 'ethers';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function LenderDetailsItems({ status, statusOptions, lender, getLenderDetails }) {
  // const renderTotal = (
  //   <Stack
  //     spacing={2}
  //     alignItems="flex-end"
  //     sx={{ my: 3, textAlign: 'right', typography: 'body2' }}
  //   >
  //     <Stack direction="row">
  //       <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
  //       <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subTotal) || '-'}</Box>
  //     </Stack>

  //     <Stack direction="row">
  //       <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
  //       <Box
  //         sx={{
  //           width: 160,
  //           ...(shipping && { color: 'error.main' }),
  //         }}
  //       >
  //         {shipping ? `- ${fCurrency(shipping)}` : '-'}
  //       </Box>
  //     </Stack>

  //     <Stack direction="row">
  //       <Box sx={{ color: 'text.secondary' }}>Discount</Box>
  //       <Box
  //         sx={{
  //           width: 160,
  //           ...(discount && { color: 'error.main' }),
  //         }}
  //       >
  //         {discount ? `- ${fCurrency(discount)}` : '-'}
  //       </Box>
  //     </Stack>

  //     <Stack direction="row">
  //       <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
  //       <Box sx={{ width: 160 }}>{taxes ? fCurrency(taxes) : '-'}</Box>
  //     </Stack>

  //     <Stack direction="row" sx={{ typography: 'subtitle1' }}>
  //       <Box>Total</Box>
  //       <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
  //     </Stack>
  //   </Stack>
  // );

  const { user, authenticated } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const [lenderTransaction, setLenderTransaction] = useState([]);

  useEffect(() => {
    getTransaction();
  }, []);

  async function whiteListLenderWallet(id, walletId, status) {
    const { haqq, arbitrum } = user;
    const wallet = new ethers.Wallet(haqq?.walletPrivateKey);
    // Create ethers wallet instance using private key
    const provider = new ethers.providers.JsonRpcProvider(haqq?.jsonURL);
    const deployer = wallet.connect(provider);

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: haqq?.haqqChainId }], //chainId must be in hexadecimal numbers
    });

    const invoiceMateContract = new ethers.Contract(
      haqq?.InvoiceMateContractAddress,
      haqq?.InvoiceMateContractABI,
      deployer
    );
    const arbWallet = new ethers.Wallet(arbitrum?.walletPrivateKey);
    // Create ethers wallet instance using private key
    const arbProvider = new ethers.providers.JsonRpcProvider(arbitrum?.jsonURL);
    const arbDeployer = arbWallet.connect(arbProvider);

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: arbitrum?.haqqChainId }], //chainId must be in hexadecimal numbers
    });

    const arbInvoiceMateContract = new ethers.Contract(
      arbitrum?.InvoiceMateContractAddress,
      arbitrum?.InvoiceMateContractABI,
      arbDeployer
    );

    try {
      await invoiceMateContract.connect(deployer).whitelistLenderAddress(walletId);
      await arbInvoiceMateContract.connect(arbDeployer).whitelistLenderAddress(walletId);
      const response = await axios.post(`${endpoints.app.updateRejectWallet}`, {
        lenderId: lender._id,
        walletId: id,
        walletStatus: status,
      });
      setLoading(false);
      enqueueSnackbar(
        `Wallet has been ${status === 'whiteList' ? 'whitelisted' : 'blacklisted'} successfully`
      );
      getLenderDetails();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error?.error?.reason || error || 'Server Error!', { variant: 'error' });
    }
  }

  const handleUpdateStatus = async (id, walletId, status) => {
    setLoading(true);
    try {
      await whiteListLenderWallet(id, walletId, status);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const getTransaction = async () => {
    setLoading(false);
    try {
      const response = await axios.get(
        endpoints.app.getTransactionLender + `?lenderId=${lender._id}`
      );
      setLenderTransaction(response);
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreenCustom />}
      <Box
        component={Paper}
        sx={{
          p: 3,
          borderRadius: 1,
          boxShadow: 3,
          mb: 3,
          mt: {
            xs: 5,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Avatar
              src={ATTACHMENT_URL + lender?.profilePicture[0]?.attachmentURL + ATTACHMENT_TOKEN}
              variant="circular"
              sx={{ width: 120, height: 120, mr: 2, mt: -10, zindex: 1000000 }}
            />
            <ListItemText
              sx={{
                mt: 0.5,
                mx: 0.5,
              }}
              primary={lender?.firstName + ' ' + lender?.lastName}
              secondary={lender?.email}
              primaryTypographyProps={{
                typography: 'h4',
              }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                mt: 0.5,
              }}
            />
          </Box>
          <Box>
            <Label
              variant="soft"
              color={
                (status === 'approve' && 'success') ||
                (status === 'needMoreDetails' && 'warning') ||
                (status === 'rejected' && 'error') ||
                'info'
              }
            >
              {statusOptions.find((x) => x.value === status)?.label || ''}
            </Label>
          </Box>
        </Box>

        <Stack
          sx={{
            px: 3,
          }}
        >
          <Box
            key={1}
            direction="row"
            alignItems="center"
            sx={{
              py: 2,
              // minWidth: 640,
              borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}`,
            }}
          />
          <Scrollbar>
            <Box display="flex" flexDirection="row" gap={2}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar color="primary">
                      <Iconify icon="eva:phone-fill" width={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Mobile Number" secondary={lender?.mobileNumber} />
                </ListItem>
              </List>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar color="primary">
                      <Iconify icon="solar:global-outline" width={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Country" secondary={lender?.country} />
                </ListItem>
              </List>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar color="primary">
                      <Iconify icon="solar:city-bold" width={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="City" secondary={lender?.geoLocation?.city} />
                </ListItem>
              </List>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar color="primary">
                      <Iconify icon="ic:round-email" width={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Email Verification"
                    secondary={lender?.isActive ? 'Active' : 'No'}
                  />
                </ListItem>
              </List>
            </Box>
          </Scrollbar>

          {/* {renderTotal} */}
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Onboarding Details" />

            <Stack
              sx={{
                px: 3,
              }}
            >
              <Scrollbar>
                <Box rowGap={5} p={2}>
                  <Stack sx={{ typography: 'body2' }} direction="row" gap={4}>
                    {lender?.identityDoc?.length > 0 ? (
                      <Box
                        sx={{
                          m: 0.5,
                          width: 100,
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          window.open(
                            ATTACHMENT_URL +
                              lender?.identityDoc[0]?.attachmentURL +
                              ATTACHMENT_TOKEN
                          )
                        }
                      >
                        <Image src={'/assets/icons/File-Icon.png'} alt="Identity Document" />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          Identity Document
                        </Typography>
                      </Box>
                    ) : (
                      '-'
                    )}

                    {/*  */}
                    {lender?.additionalDocument?.length > 0 ? (
                      <Box
                        sx={{
                          m: 0.5,
                          width: 100,
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          window.open(
                            ATTACHMENT_URL +
                              lender?.additionalDocument[0]?.attachmentURL +
                              ATTACHMENT_TOKEN
                          )
                        }
                      >
                        <Image src={'/assets/icons/File-Icon.png'} alt="Identity Document" />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          Additional Document
                        </Typography>
                      </Box>
                    ) : (
                      '-'
                    )}
                  </Stack>
                </Box>
              </Scrollbar>

              {/* {renderTotal} */}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Connected Wallets" />

            <Stack
              sx={{
                px: 3,
              }}
            >
              <br />
              <Scrollbar>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                  <Table size={'medium'} sx={{ minWidth: 960 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Wallet Name</TableCell>
                        <TableCell>Wallet Address</TableCell>
                        <TableCell>Wallet Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lender?.wallet?.map((item, index) => (
                        <TableRow>
                          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar alt={item?.walletName} src={item?.walletIcon} sx={{ mr: 2 }} />

                            <ListItemText
                              primary={item.walletName}
                              // secondary={email}
                              primaryTypographyProps={{ typography: 'body2' }}
                              secondaryTypographyProps={{
                                component: 'span',
                                color: 'text.disabled',
                              }}
                            />
                          </TableCell>
                          {/* <TableCell>{item?.walletName}</TableCell> */}
                          <TableCell>{item?.walletAddress}</TableCell>
                          <TableCell>
                            <Label color="primary">{item?.walletStatus.toUpperCase()}</Label>
                          </TableCell>
                          <TableCell>
                            {' '}
                            <Tooltip title="WhiteList Wallet">
                              <IconButton
                                onClick={() =>
                                  handleUpdateStatus(item?._id, item?.walletAddress, 'whiteList')
                                }
                                disabled={item?.walletStatus === 'whiteList'}
                              >
                                <Iconify icon="quill:paper" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="BlackList Wallet">
                              <IconButton
                                onClick={() =>
                                  handleUpdateStatus(item?._id, item?.walletAddress, 'blackList')
                                }
                                disabled={item?.walletStatus === 'blackList'}
                              >
                                <Iconify icon="material-symbols:block" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }} />
      <Card>
        <CardHeader title="Transactions" />

        <Stack
          sx={{
            px: 3,
          }}
        >
          <br />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table size={'medium'} sx={{ minWidth: 960 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Lender</TableCell>
                  <TableCell>Transaction Hash</TableCell>
                  <TableCell>Loan Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lenderTransaction?.length > 0 ? (
                  lenderTransaction?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{fDateTime(item?.createdAt)}</TableCell>
                      <TableCell>
                        <ListItemText
                          primary={item?.dealData?.borrower?.name || ''}
                          secondary={
                            <Typography sx={{ fontWeight: '500' }}>
                              {/* {financialDetail?.monthlyTurnover || ''} */}
                            </Typography>
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <ListItemText
                          primary={item?.lenderData?.firstName + item?.lenderData?.lastName || ''}
                          secondary={
                            <Typography sx={{ fontWeight: '500' }}>
                              {/* {financialDetail?.monthlyTurnover || ''} */}
                            </Typography>
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            item?.status === 'Lending'
                              ? item?.hash
                              : item?.repaymentTransectionDetails?.hash
                          }
                        >
                          {shortenHash(
                            item?.status === 'Lending'
                              ? item?.hash
                              : item?.repaymentTransectionDetails?.hash,
                            10
                          )}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {item?.status === 'Lending'
                          ? fCurrency(item?.dealData?.overview?.loanAmount)
                          : fCurrency(item?.repaymentAmount)}
                      </TableCell>
                      <TableCell>
                        <Label variant="outlined" color="primary">
                          {item?.status === 'Lending' ? 'LENDING' : 'REPAYMENT'}
                        </Label>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={'View Transaction'}>
                          <IconButton
                            onClick={() => {
                              if (item?.dealData?.overview?.chain === 'Haqq Network') {
                                window.open(
                                  `${IM_HOST_EXPLORER}/tx/${
                                    item?.status === 'Lending'
                                      ? item?.hash
                                      : item?.repaymentTransectionDetails?.hash
                                  }`
                                );
                              } else {
                                window.open(
                                  `${IM_HOST_ARB_EXPLORER}/tx/${
                                    item?.status === 'Lending'
                                      ? item?.hash
                                      : item?.repaymentTransectionDetails?.hash
                                  }`
                                );
                              }
                            }}
                          >
                            <Iconify icon="carbon:view-filled" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={'Copy Hash'}>
                          <IconButton
                            onClick={() =>
                              handleCopy(
                                item?.status === 'Lending'
                                  ? item?.hash
                                  : item?.repaymentTransectionDetails?.hash
                              )
                            }
                          >
                            <Iconify icon="solar:copy-bold" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Card>
    </>
  );
}

LenderDetailsItems.propTypes = {
  status: PropTypes.string,
  statusOptions: PropTypes.array,
};
