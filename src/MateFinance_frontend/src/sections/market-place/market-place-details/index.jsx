import React, { useEffect, useState } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import {
  Card,
  Avatar,
  Grid,
  IconButton,
  Button,
  Typography,
  Box,
  Divider,
  CardHeader,
  ListItemText,
  Tooltip,
  CardContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import FinanceStatusTimeLine from 'src/sections/financing-profile/finance-status-timeline';
import { _mock } from 'src/_mock';
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';
import { useAuthContext } from 'src/auth/hooks';
import { TableNoData } from 'src/components/table';
import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import { useParams } from 'react-router-dom';
import { fCurrency } from 'src/utils/format-number';
import { handleCopy, shortenHash } from 'src/utils/change-case';
import { fDateTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import InvoiceTokenCard from '../market-place-invoice-token-card';
import { InvoiceMateContractAddress } from 'src/blockchain-config';
import { ethers } from 'ethers';
import { IM_HOST_ARB_EXPLORER, IM_HOST_EXPLORER, IM_HOST_UI } from '../../../config-global';
import { ConfirmDialog } from 'src/components/custom-dialog';

const MarketPlaceDetails = () => {
  const { id } = useParams();

  const urlSearchParams = new URLSearchParams(window.location.search);

  const extendView = urlSearchParams.get('extendview');

  const tab = urlSearchParams.get('tab');

  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();
  const router = useRouter();

  const { user, authenticated } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const [lenderTransaction, setLenderTransaction] = useState([]);

  const [deal, setDeal] = useState(null);

  const [lenderDetails, setLenderDetails] = useState(null);

  const [extendDays, setExtendDays] = useState(0);

  const [state, setState] = useState({
    action: '',
    internalComments: '',
    externalComments: '',
  });
  const authDialog = useBoolean();
  const extendDialog = useBoolean();
  const confirm = useBoolean();
  const commentsDialog = useBoolean();

  useEffect(() => {
    handleDealDetails();
    if (user) {
      getLenderDetails();
      getTransaction();
    }
  }, []);

  const getLenderDetails = async () => {
    try {
      const response = await axios.get(`${endpoints.app.getLenderById}?id=${user?.id}`);
      let lender = response?.lender[0];
      setLenderDetails(lender);
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const handleDealDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(endpoints.app.getDealById + id);
      setDeal(response[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, {
        variant: 'error',
      });
    }
  };

  const getTransaction = async () => {
    setLoading(false);
    try {
      const response = await axios.get(endpoints.app.getTransactionLender + `?dealId=${id}`);
      setLenderTransaction(response);
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setLoading(false);
    }
  };

  const onClose = () => {
    authDialog.onFalse();
  };

  const handleResetState = async () => {
    setState((state) => {
      return {
        action: '',
        internalComments: '',
        externalComments: '',
      };
    });
    commentsDialog.onFalse();
  };

  async function _depositFunds() {
    const { haqq } = user;
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

    try {
      // HAQ
      const tx = await invoiceMateContract
        .connect(deployer)
        .approveLoanFiroza(
          deal?.borrower?.borrowerWallet,
          deal?.returnBlockChainId,
          deal?.overview?.liquidityPool === 'High Risk Pool' ? 1 : 0
        );
      await tx.wait();
      await saveLenderTransactionDetail(tx);
      setLoading(false);
      await handleDealDetails();
      await getLenderDetails();
      await getTransaction();
      enqueueSnackbar('Funds Transferred');
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error?.error?.reason || error || 'Server Error!', { variant: 'error' });
    }
  }

  const saveLenderTransactionDetail = async (txn) => {
    try {
      const response = await axios.post(endpoints.app.saveTransactionLender, {
        id: id,
        borrower: deal?.Borrower?._id,
        principal: deal?.overview?.loanAmount,
        interest: deal?.overview?.apyRate,
        hash: txn?.hash || '',
        transaction: txn,
        status: 'Lending',
        invoiceMongoId: deal?.Borrower?.invoiceMongoId,
      });
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setLoading(false);
    }
  };

  const approveLoan = async () => {
    try {
      setLoading(true);
      await _depositFunds();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  async function cancelLoan() {
    if (state.internalComments === '' || state.externalComments === '') {
      enqueueSnackbar('Internal & external comments are required!', { variant: 'info' });
      return;
    }
    setLoading(true);
    let check = deal?.overview?.chain === 'Haqq Network';
    const { haqq, arbitrum } = user;
    const wallet = new ethers.Wallet(check ? haqq?.walletPrivateKey : arbitrum?.walletPrivateKey);
    // Create ethers wallet instance using private key
    const provider = new ethers.providers.JsonRpcProvider(
      check ? haqq?.jsonURL : arbitrum?.jsonURL
    );
    const deployer = wallet.connect(provider);

    const InvoiceMateContract = new ethers.Contract(
      check ? haqq?.InvoiceMateContractAddress : arbitrum?.InvoiceMateContractAddress,
      check ? haqq?.InvoiceMateContractABI : arbitrum?.InvoiceMateContractABI,
      deployer
    );

    try {
      await InvoiceMateContract.connect(deployer).changeStateOfLoan(
        deal?.borrower?.borrowerWallet,
        deal?.returnBlockChainId,
        4
      );
      await axios.post(`${endpoints.app.cancelDeal}`, {
        dealId: id,
        internalComments: state.internalComments,
        externalComments: state.externalComments,
      });
      setLoading(false);
      handleResetState();
      await handleDealDetails();
      enqueueSnackbar('Deal Cancelled Successfully');
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err, { variant: 'error' });
      console.log(err);
    }
  }

  async function rejectLoan() {
    if (state.internalComments === '' || state.externalComments === '') {
      enqueueSnackbar('Internal & external comments are required!', { variant: 'info' });
      return;
    }
    setLoading(true);
    let check = deal?.overview?.chain === 'Haqq Network';
    const { haqq, arbitrum } = user;
    const wallet = new ethers.Wallet(check ? haqq?.walletPrivateKey : arbitrum?.walletPrivateKey);
    // Create ethers wallet instance using private key
    const provider = new ethers.providers.JsonRpcProvider(
      check ? haqq?.jsonURL : arbitrum?.jsonURL
    );
    const deployer = wallet.connect(provider);

    const InvoiceMateContract = new ethers.Contract(
      check ? haqq?.InvoiceMateContractAddress : arbitrum?.InvoiceMateContractAddress,
      check ? haqq?.InvoiceMateContractABI : arbitrum?.InvoiceMateContractABI,
      deployer
    );

    try {
      await InvoiceMateContract.connect(deployer).changeStateOfLoan(
        deal?.borrower?.borrowerWallet,
        deal?.returnBlockChainId,
        4
      );
      const response = await axios.post(`${endpoints.app.rejectDeal}`, {
        dealId: id,
      });
      setLoading(false);
      await handleDealDetails();
      handleResetState();
      enqueueSnackbar('Deal Rejected Successfully');
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err, { variant: 'error' });
      console.log(err);
    }
  }

  const cancelDeal = async () => {
    try {
      setState((state) => {
        return {
          ...state,
          action: 'cancel',
        };
      });
      confirm.onTrue();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const rejectDeal = async () => {
    try {
      setState((state) => {
        return {
          ...state,
          action: 'reject',
        };
      });
      confirm.onTrue();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const submitExpiry = async () => {
    try {
      setLoading(true);
      await axios.post(`${endpoints.app.extendDays}`, {
        _id: id,
        dealExpiresIn: `${extendDays} ${extendDays > 1 ? 'days' : 'day'}`,
      });
      enqueueSnackbar('Expiry has extended!');
      await handleDealDetails();
      extendDialog.onFalse();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const approve = async () => {
    try {
      setLoading(true);
      const wallet = new ethers.Wallet(
        'b5f923b26452f72582b278045b921d64ed12cb9c98dbd4fa409b8206da1300b8'
      );
      // Create ethers wallet instance using private key
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.eth.haqq.network');
      const deployer = wallet.connect(provider);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2be3' }], //chainId must be in hexadecimal numbers
      });
      const USDCContractAddress = '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd';
      const USDCContractABI = ['function approve(address,uint256)'];
      const usdcContract = new ethers.Contract(USDCContractAddress, USDCContractABI, deployer);
      const account = new ethers.providers.Web3Provider(window.ethereum);
      await account.send('eth_requestAccounts', []);

      const lender = account.getSigner();
      const amount = 100000000000;
      const haqqContractAddress = '0x3eB2dA8108aF1Bad409DF95e6172248dB5b7d3Ca';
      await usdcContract.connect(lender).approve(haqqContractAddress, amount.toString());
      setLoading(false);
      enqueueSnackbar('Successfully Approved');
    } catch (e) {
      enqueueSnackbar(e);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreenCustom />}
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Grid container>
          <Grid sm={12} md={user && user?.role === 1 ? 8 : 8} sx={{ p: 1 }}>
            {user?.role === 1 && deal?.status === 'draft' && (
              <Button
                sx={{ ml: 1 }}
                color="primary"
                variant="contained"
                size="small"
                onClick={() =>
                  router.push(
                    `${paths.dashboard.marketPlace.createMarketPlace}?edit=${true}&id=${deal?._id}`
                  )
                }
              >
                <Iconify icon="solar:pen-bold" />
                Edit
              </Button>
            )}
            {user?.role === 2 &&
              (deal?.status !== 'lending' &&
              deal?.status !== 'Repayment' &&
              deal?.status !== 'repayment' &&
              deal?.status !== 'closed' &&
              deal?.status !== 'expired' &&
              deal?.status !== 'cancelled' &&
              deal?.status !== 'rejected' &&
              !deal?.isFirozaAPI ? (
                // deal?.overview?.blockchainNetwork !== 'Haqq Network'
                <Button
                  sx={{ float: 'right' }}
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    if (lenderDetails?.status !== 'approve') {
                      enqueueSnackbar('Your profile in approval process. please wait...', {
                        variant: 'info',
                      });
                      return;
                    }
                    router.push(`${paths.dashboard.marketPlace.lendNow}?id=${deal?._id}`);
                  }}
                >
                  Invest Now
                </Button>
              ) : (
                ''
              ))}
            {!user &&
              (deal?.status !== 'lending' &&
              deal?.status !== 'Repayment' &&
              deal?.status !== 'repayment' &&
              deal?.status !== 'closed' &&
              deal?.status !== 'expired' &&
              deal?.status !== 'cancelled' &&
              deal?.status !== 'rejected' &&
              !deal?.isFirozaAPI ? (
                <Button
                  sx={{ float: 'right' }}
                  color="primary"
                  variant="contained"
                  onClick={() => authDialog.onTrue()}
                  // onClick={approve}
                >
                  Invest Now
                </Button>
              ) : (
                ''
              ))}
            {user?.role === 1 && deal?.status === 'expired' ? (
              <Button
                sx={{ float: 'right' }}
                color="primary"
                variant="contained"
                onClick={() => {
                  extendDialog.onTrue();
                  setExtendDays(0);
                }}
              >
                Extend Expiry
              </Button>
            ) : (
              ''
            )}
            <Stack direction="row" justifyContent="space-between">
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() => router.back()}
              >
                <Iconify icon="mingcute:arrow-left-fill" />
                Back
              </Button>
              <Stack direction="row" gap={2}>
                {user?.role === 1 &&
                deal?.status !== 'lending' &&
                deal?.status !== 'Repayment' &&
                deal?.status !== 'repayment' &&
                deal?.status !== 'closed' &&
                deal?.status !== 'expired' &&
                deal?.status !== 'cancelled' &&
                deal?.status !== 'rejected' &&
                deal?.isFirozaAPI ? (
                  <Button
                    sx={{ float: 'right' }}
                    color="primary"
                    variant="contained"
                    onClick={approveLoan}
                  >
                    Transfer Funds
                  </Button>
                ) : (
                  ''
                )}
                {user?.role === 1 && deal?.status === 'tokenized' ? (
                  <Button
                    sx={{ float: 'right' }}
                    color="primary"
                    variant="contained"
                    onClick={cancelDeal}
                  >
                    Cancel Deal
                  </Button>
                ) : (
                  ''
                )}
                {user?.role === 1 && deal?.status === 'tokenized' ? (
                  <Button
                    sx={{ float: 'right' }}
                    color="primary"
                    variant="contained"
                    onClick={rejectDeal}
                  >
                    Reject Deal
                  </Button>
                ) : (
                  ''
                )}
              </Stack>
            </Stack>
            <Box
              sx={{
                width: '100%',
                // height: '100vh',
                padding: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <InvoiceTokenCard deal={deal} />
            </Box>
          </Grid>
          {user && user?.role === 1 && (
            <Grid xs={12} md={4} sx={{ p: 1, mx: 'auto' }}>
              <Card sx={{ mt: 6 }}>{deal && <FinanceStatusTimeLine invoice={deal} />}</Card>
            </Grid>
          )}
        </Grid>

        <Card sx={{ mt: 2 }}>
          <CardHeader title="Borrower" />

          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1" gutterBottom>
                Borrower Name: {deal?.borrower?.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {deal?.borrower?.summary}
              </Typography>
              <Stack flexDirection="row" spacing={2}>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  endIcon={<Iconify icon="ion:arrow-redo-outline" />}
                  onClick={() => {
                    const websiteLink = deal?.borrower?.websiteLink;
                    if (websiteLink) {
                      const modifiedLink = websiteLink.startsWith('https://')
                        ? websiteLink
                        : `https://${websiteLink}`;
                      window.open(modifiedLink);
                    }
                  }}
                  disabled={!deal?.borrower?.websiteLink}
                >
                  Borrower Website
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  endIcon={<Iconify icon="ion:arrow-redo-outline" />}
                  onClick={() =>
                    window.open(
                      `${IM_HOST_UI}/auth/jwt/invoice_view/${deal?.Borrower?.loanRequestId}`
                    )
                  }
                >
                  Invoice
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  endIcon={<Iconify icon="ion:arrow-redo-outline" />}
                  onClick={() => {
                    const { haqq, arbitrum } = user;
                    if (deal?.overview?.chain === 'Haqq Network') {
                      window.open(
                        `${IM_HOST_EXPLORER}/address/${haqq?.InvoiceMateContractAddress}`
                      );
                    } else {
                      window.open(
                        `${IM_HOST_ARB_EXPLORER}/address/${arbitrum?.InvoiceMateContractAddress}`
                      );
                    }
                  }}
                >
                  Smart Contract
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => {
                    const websiteLink = deal?.borrower?.linkedinLink;
                    if (websiteLink) {
                      const modifiedLink = websiteLink.startsWith('https://')
                        ? websiteLink
                        : `https://${websiteLink}`;
                      window.open(modifiedLink);
                    }
                  }}
                  endIcon={<Iconify icon="ion:arrow-redo-outline" />}
                  disabled={!deal?.borrower?.linkedinLink}
                >
                  LinkedIn
                </Button>

                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  endIcon={<Iconify icon="ion:arrow-redo-outline" />}
                  onClick={() => {
                    const websiteLink = deal?.borrower?.twitterLink;
                    if (websiteLink) {
                      const modifiedLink = websiteLink.startsWith('https://')
                        ? websiteLink
                        : `https://${websiteLink}`;
                      window.open(modifiedLink);
                    }
                  }}
                  disabled={!deal?.borrower?.twitterLink}
                >
                  Twitter
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2 }}>
          <CardHeader title="Underwriter" />
          <CardContent>
            <Stack flexDirection="row" justifyContent="space-between">
              <Stack spacing={1}>
                <Typography variant="subtitle1" gutterBottom>
                  Name: {deal?.underwriter?.underWName}
                </Typography>
              </Stack>
            </Stack>
            <Button
              variant="text"
              color="primary"
              size="small"
              endIcon={<Iconify icon="ion:arrow-redo-outline" />}
              onClick={() => {
                const websiteLink = deal?.underwriter?.underWLink;
                if (websiteLink) {
                  const modifiedLink = websiteLink.startsWith('https://')
                    ? websiteLink
                    : `https://${websiteLink}`;
                  window.open(modifiedLink);
                }
              }}
              disabled={!deal?.underwriter?.underWLink}
            >
              Website
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2 }}>
          <CardHeader title="Risk Mitigation" />
          <CardContent>
            <Stack flexDirection="row" justifyContent="space-between">
              <Stack spacing={1}>
                <Typography variant="subtitle1" gutterBottom>
                  KYI Report
                </Typography>
              </Stack>
            </Stack>
            <Button
              variant="text"
              color="primary"
              size="small"
              endIcon={<Iconify icon="ion:arrow-redo-outline" />}
              onClick={() => {
                const websiteLink = deal?.riskMitigation?.kyiLink;
                if (websiteLink) {
                  const modifiedLink = websiteLink.startsWith('https://')
                    ? websiteLink
                    : `https://${websiteLink}`;
                  window.open(modifiedLink);
                }
              }}
              disabled={!deal?.riskMitigation?.kyiLink}
            >
              Learn More
            </Button>
          </CardContent>
        </Card>
        {extendView === 'true' && (
          <Card sx={{ p: 3, mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Lender Name: {deal?.borrower?.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {deal?.borrower?.summary}
            </Typography>
          </Card>
        )}
        {user?.role === 1 || (user?.role === 2 && tab === 'myDeals') ? (
          <Card sx={{ mt: 2 }}>
            <CardHeader title="Recent Transaction" />

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
                              primary={
                                item?.lenderData?.firstName + item?.lenderData?.lastName || ''
                              }
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
        ) : (
          ''
        )}
      </Container>

      <Dialog fullWidth maxWidth="xs" open={authDialog.value} onClose={onClose}>
        <DialogTitle sx={{ pb: 2 }}>
          {'Unauthorized!'}
          <IconButton onClick={onClose} sx={{ float: 'right' }}>
            <Iconify icon="carbon:close-filled" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          {' '}
          {'Please sign in or sign up to use this feature.'}{' '}
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => router.push(paths.auth.jwt.login)}
          >
            Sign in
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => router.push(paths.auth.jwt.register)}
          >
            Sign up
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={extendDialog.value}
        onClose={() => extendDialog.onFalse()}
      >
        <DialogTitle sx={{ pb: 2 }}>{'Extend Deal Expiry'}</DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          <TextField
            fullWidth
            type={'number'}
            value={extendDays}
            onChange={(event) => {
              setExtendDays(event.target.value);
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">Days</InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '32px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '32px',
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={submitExpiry}>
            Submit
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => extendDialog.onFalse()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth="sm" fullWidth open={commentsDialog.value} onClose={commentsDialog.onFalse}>
        <DialogTitle>Actions</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              margin="normal"
              id="internalComments"
              label="Internal Notes"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={state.internalComments}
              onChange={(e) => setState({ ...state, internalComments: e.target.value })}
            />
            <TextField
              rows={3}
              margin="normal"
              id="externalComments"
              label="External Notes"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              value={state.externalComments}
              onChange={(e) => setState({ ...state, externalComments: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={state.action === 'cancel' ? cancelLoan : rejectLoan}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
          <Button onClick={handleResetState} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={state.action === 'cancel' ? 'Cancel Deal' : 'Reject Deal'}
        content={
          state.action === 'cancel'
            ? 'Are you sure want to cancel?'
            : 'Are you sure want to reject?'
        }
        action={
          <Button
            variant="contained"
            sx={{ background: 'red' }}
            onClick={() => {
              commentsDialog.onTrue();
              confirm.onFalse();
            }}
          >
            Confirm
          </Button>
        }
      />
    </>
  );
};

export default MarketPlaceDetails;
