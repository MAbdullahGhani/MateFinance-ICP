import React, { useEffect, useState } from 'react';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Card, Avatar, Grid, IconButton, Button, Typography, Box, Divider, TextField, CardHeader, InputAdornment, } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import { _mock } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';
import { useAuthContext } from 'src/auth/hooks';
import { useNavigate } from 'react-router-dom';
import { TableNoData } from 'src/components/table';
import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import { formatCurrency } from 'src/utils/format-number';
import { ethers } from 'ethers';
import OnchainID from '@onchain-id/solidity';
import SimpleCustomBreadcrumbs from 'src/components/simple-custom-breadcrumbs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Scrollbar from 'src/components/scrollbar';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';
import Label from 'src/components/label';
import { IM_HOST_ARB_EXPLORER, IM_HOST_EXPLORER } from 'src/config-global';
const LenderLendDeal = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const settings = useSettingsContext();
    const { user } = useAuthContext();
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get('id');
    const [loading, setLoading] = useState(false);
    const [financialDetail, setFinancialDetail] = useState(null);
    const [lendingAmt, setLendingAmt] = useState(0);
    const [lenderDetails, setLenderDetails] = useState(null);
    const [lendingWallet, setLendingWallet] = useState(null);
    const selectWallet = useBoolean();
    useEffect(() => {
        if (id) {
            getDeal();
            getLenderDetails();
        }
    }, []);
    const getDeal = async () => {
        setLoading(false);
        try {
            const response = await axios.get(`${endpoints.app.getDealById}/${id}`);
            const deal = response[0];
            setFinancialDetail(deal);
            setLendingAmt(deal?.overview?.loanAmount);
        }
        catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
            setLoading(false);
        }
    };
    const getLenderDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${endpoints.app.getLenderById}?id=${user.id}`);
            setLenderDetails(response?.lender[0]);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            enqueueSnackbar(error, { variant: 'error' });
        }
    };
    const saveLenderTransactionDetail = async (txn, walletAddress) => {
        try {
            const response = await axios.post(endpoints.app.saveTransactionLender, {
                id: id,
                borrower: financialDetail?.Borrower?._id,
                principal: lendingAmt,
                interest: financialDetail?.overview?.apyRate,
                hash: txn?.hash || '',
                transaction: txn,
                status: 'Lending',
                walletAddress: walletAddress,
            });
        }
        catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
            setLoading(false);
        }
    };
    let blockChainErr = false;
    async function _depositFunds() {
        const { haqq, arbitrum } = user;
        let check = financialDetail?.overview?.chain === 'Haqq Network';
        debugger;
        // const TokenAgent = new ethers.Wallet(
        //   check ? haqq?.tokenAgentPrivateKey : arbitrum?.tokenAgentPrivateKey
        // );
        // const ClaimIssuer = new ethers.Wallet(
        //   check ? haqq?.claimIssuerPrivateKey : arbitrum?.claimIssuerPrivateKey
        // );
        const wallet = new ethers.Wallet(check ? haqq?.walletPrivateKey : arbitrum?.walletPrivateKey);
        // Create ethers wallet instance using private key
        const provider = new ethers.providers.JsonRpcProvider(check ? haqq?.jsonURL : arbitrum?.jsonURL);
        const deployer = wallet.connect(provider);
        // const tokenAgent = TokenAgent.connect(provider);
        // const claimIssuer = ClaimIssuer.connect(provider);
        if (!window.ethereum) {
            enqueueSnackbar('Please install MetaMask or connect to a wallet', { variant: 'error' });
            return;
        }
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: check ? haqq?.haqqChainId : arbitrum?.haqqChainId }], //chainId must be in hexadecimal numbers
        });
        const invoiceMateContract = new ethers.Contract(check ? haqq?.InvoiceMateContractAddress : arbitrum?.InvoiceMateContractAddress, check ? haqq?.InvoiceMateContractABI : arbitrum?.InvoiceMateContractABI, deployer);
        // const identityRegistry = new ethers.Contract(
        //   check ? haqq?.identityRegistryAddress : arbitrum?.identityRegistryAddress,
        //   check ? haqq?.identityRegistryABI : arbitrum?.identityRegistryABI,
        //   deployer
        // );
        // const token = new ethers.Contract(
        //   check ? haqq?.tokenAddress : arbitrum?.tokenAddress,
        //   check ? haqq?.tokenABI : arbitrum?.tokenABI,
        //   deployer
        // );
        // Request account access if needed
        const account = new ethers.providers.Web3Provider(window.ethereum);
        await account.send('eth_requestAccounts', []);
        const lender = account.getSigner();
        const lenderAddress = await lender.getAddress();
        // const borrower = financialDetail?.Borrower?.wallets[0]?.walletAddress;
        const USDT = new ethers.Contract(check ? haqq?.usdtAddress : arbitrum?.usdtAddress, check ? haqq?.usdtabi : arbitrum?.usdtabi, deployer);
        const borrowerExist = await invoiceMateContract.borrowerExist(financialDetail?.borrower?.borrowerWallet);
        const borrowerData = await invoiceMateContract.getBorrowerLoanDetails(financialDetail?.borrower?.borrowerWallet, financialDetail?.returnBlockChainId);
        const principal = parseInt(borrowerData[2]);
        const lenderBalance = parseInt(await USDT.balanceOf(lenderAddress));
        try {
            setLoading(true);
            if (borrowerExist == true) {
                // if (borrowerData[10] == false) {
                if (lenderBalance >= principal) {
                    if (check) {
                        // HAQ
                        await USDT.connect(lender).approve(haqq?.InvoiceMateContractAddress, principal.toString());
                        const tx = await invoiceMateContract
                            .connect(deployer)
                            .approveLoan(lenderAddress, financialDetail?.borrower?.borrowerWallet, financialDetail?.returnBlockChainId);
                        await tx.wait();
                        saveLenderTransactionDetail(tx, lenderAddress);
                    }
                    else {
                        // Arbitrm
                        await USDT.connect(lender).approve(arbitrum?.InvoiceMateContractAddress, principal.toString());
                        const tx = await invoiceMateContract
                            .connect(deployer)
                            .approveLoan(lenderAddress, financialDetail?.borrower?.borrowerWallet, financialDetail?.returnBlockChainId);
                        await tx.wait();
                        saveLenderTransactionDetail(tx, lenderAddress);
                    }
                    // Minting 3643 token and sending to the lender
                    // const verified = await identityRegistry.isVerified(lenderAddress);
                    // //  await verified.wait();
                    // console.log(verified);
                    // if (verified == false) {
                    //   const lenderIdentity = await deployIdentityProxy(
                    //     check
                    //       ? haqq?.identityImplementationAuthorityAddress
                    //       : arbitrum?.identityImplementationAuthorityAddress,
                    //     lenderAddress,
                    //     deployer
                    //   );
                    //   await lenderIdentity
                    //     .connect(lender)
                    //     .addKey(
                    //       ethers.utils.keccak256(
                    //         ethers.utils.defaultAbiCoder.encode(['address'], [lenderAddress])
                    //       ),
                    //       2,
                    //       1
                    //     );
                    //   const txn = await identityRegistry
                    //     .connect(tokenAgent)
                    //     .registerIdentity(lenderAddress, lenderIdentity.address, 42);
                    //   await txn.wait();
                    //   const claimTopics = [ethers.utils.id('CLAIM_TOPIC')];
                    //   const claimForSigner = {
                    //     data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Some claim public data.')),
                    //     issuer: check
                    //       ? haqq?.claimIssuerContractAddress
                    //       : arbitrum?.claimIssuerContractAddress,
                    //     topic: claimTopics[0],
                    //     scheme: 1,
                    //     identity: lenderIdentity.address,
                    //     signature: '',
                    //   };
                    //   claimForSigner.signature = await claimIssuer.signMessage(
                    //     ethers.utils.arrayify(
                    //       ethers.utils.keccak256(
                    //         ethers.utils.defaultAbiCoder.encode(
                    //           ['address', 'uint256', 'bytes'],
                    //           [claimForSigner.identity, claimForSigner.topic, claimForSigner.data]
                    //         )
                    //       )
                    //     )
                    //   );
                    //   // const tokenAddress = "0xc8c6eF7f75001868dED9dCce61442Ec13C94405a";
                    //   await lenderIdentity
                    //     .connect(lender)
                    //     .addClaim(
                    //       claimForSigner.topic,
                    //       claimForSigner.scheme,
                    //       claimForSigner.issuer,
                    //       claimForSigner.signature,
                    //       claimForSigner.data,
                    //       ''
                    //     );
                    //   // const amount = ethers.utils.parseUnits("100", 18);
                    //   await token.connect(tokenAgent).mint(lenderAddress, (principal / 1000000).toString());
                    // } else {
                    //   await token.connect(tokenAgent).mint(lenderAddress, (principal / 1000000).toString());
                    // }
                    const response = await axios.post(`${endpoints.app.lendNow}`, {
                        lenderId: user?.id,
                        lendingAmount: lendingAmt,
                        dealId: id,
                        status: false,
                        walletAddress: lendingWallet?.walletAddress,
                        invoiceMongoId: financialDetail?.Borrower?.invoiceMongoId,
                    });
                    setLoading(false);
                    handleCloseSelectWallet();
                    enqueueSnackbar('Funds has been transferred!');
                    navigate(-1);
                    console.log('done');
                }
                else {
                    setLoading(false);
                    enqueueSnackbar('You do not have enough balance to deposit to borrower');
                }
                // }
                // else {
                //   enqueueSnackbar('This borrower have already received funds');
                // }
            }
            else {
                setLoading(false);
                enqueueSnackbar("Borrower doesn't exist");
            }
        }
        catch (error) {
            blockChainErr = true;
            setLoading(false);
            if (error.code === 4902) {
                try {
                    await window?.ethereum?.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: check ? haqq?.haqqChainId : arbitrum?.haqqChainId,
                                chainName: check ? 'Haqq Mainnet' : 'Arbitrum Mainnet',
                                nativeCurrency: check
                                    ? { name: 'HAQQ', symbol: 'HAQQ', decimals: 18 }
                                    : { name: 'ARB', symbol: 'ARB', decimals: 18 },
                                rpcUrls: check ? [haqq?.jsonURL] : [arbitrum?.jsonURL],
                                blockExplorerUrls: check ? [IM_HOST_EXPLORER] : [IM_HOST_ARB_EXPLORER],
                            },
                        ],
                    });
                }
                catch (addError) {
                    // console.log("Error while adding");
                    // console.log(addError);
                }
            }
            enqueueSnackbar(error?.error?.reason || error || 'Server Error!', { variant: 'error' });
        }
    }
    async function deployIdentityProxy(implementationAuthority, managementKey, signer) {
        try {
            // Deploy the IdentityProxy contract
            const IdentityProxyFactory = new ethers.ContractFactory(OnchainID.contracts.IdentityProxy.abi, OnchainID.contracts.IdentityProxy.bytecode, signer);
            const identity = await IdentityProxyFactory.deploy(implementationAuthority, managementKey);
            // Wait for the deployment to be mined
            await identity.deployed();
            // Get the deployed contract address
            const contractAddress = identity.address;
            console.log(`IdentityProxy deployed at address: ${contractAddress}`);
            // Create a contract instance for the deployed contract
            const identityContract = new ethers.Contract(contractAddress, OnchainID.contracts.Identity.abi, signer);
            return identityContract;
        }
        catch (error) {
            console.error('Error deploying IdentityProxy:', error);
            throw error; // Re-throw the error after logging it
        }
    }
    const handleSelectWallet = () => {
        selectWallet.onTrue();
    };
    const handleCloseSelectWallet = () => {
        selectWallet.onFalse();
        setLendingWallet(null);
    };
    const handleLendingReq = async () => {
        blockChainErr = false;
        if (Number(lendingAmt) < financialDetail?.overview?.minimumFinancingAmt) {
            enqueueSnackbar('Lending amount can not be less than minimum financing amount. ', {
                variant: 'error',
            });
            return;
        }
        if (Number(lendingAmt) > financialDetail?.overview?.maximumFinancingAmt) {
            enqueueSnackbar('Lending amount can not be greater than maximum financing amount.', {
                variant: 'error',
            });
            return;
        }
        // if (lenderDetails?.wallet[0]?.walletStatus !== 'whiteList') {
        //   enqueueSnackbar('Your wallet is not whitelisted please try again after sometime.', {
        //     variant: 'error',
        //   });
        //   return;
        // }
        try {
            await _depositFunds();
        }
        catch (error) {
            if (error.code === 4902) {
                const { haqq, arbitrum } = user;
                let check = financialDetail?.overview?.chain === 'Haqq Network';
                try {
                    await window?.ethereum?.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: check ? haqq?.haqqChainId : arbitrum?.haqqChainId,
                                chainName: check ? 'Haqq Mainnet' : 'Arbitrum Mainnet',
                                nativeCurrency: check
                                    ? { name: 'HAQQ', symbol: 'HAQQ', decimals: 18 }
                                    : { name: 'ARB', symbol: 'ARB', decimals: 18 },
                                rpcUrls: check ? [haqq?.jsonURL] : [arbitrum?.jsonURL],
                                blockExplorerUrls: check ? [IM_HOST_EXPLORER] : [IM_HOST_ARB_EXPLORER],
                            },
                        ],
                    });
                }
                catch (addError) {
                    // console.log("Error while adding");
                    // console.log(addError);
                }
            }
            enqueueSnackbar(error?.reason || error || 'Server Error!', { variant: 'error' });
            setLoading(false);
        }
    };
    return (<>
      {loading && <LoadingScreenCustom />}
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <IconButton sx={{
            backgroundColor: 'black',
            '&:hover': {
                backgroundColor: 'black',
            },
        }} color="primary" size="small" onClick={() => navigate(-1)}>
          <Iconify icon="mingcute:arrow-left-fill" color="white"/>
        </IconButton>
        <SimpleCustomBreadcrumbs heading="Lending Details" links={[
            {
                name: 'Dashboard',
                href: paths.dashboard.root,
            },
            {
                name: 'Deals',
                href: paths.dashboard.marketPlace.marketPlaceList,
            },
            { name: 'Lending Details' },
        ]} sx={{
            mb: { xs: 3, md: 5 },
        }}/>

        <Grid container>
          <Grid sm={12} md={8} sx={{ p: 1 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                New Lending
              </Typography>
              <br />
              <Stack flexDirection="column" justifyContent="space-between" spacing={2}>
                <TextField label="Lending Amount" type="number" disabled InputProps={{
            startAdornment: <InputAdornment position="start">USD</InputAdornment>,
        }} sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: '32px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '32px',
            },
        }} value={lendingAmt} InputLabelProps={{ shrink: true }} onChange={(event) => setLendingAmt(event.target.value)}/>
                <Stack>
                  <Typography>FINANCING PERIOD</Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {financialDetail?.overview?.loanTenure}
                  </Typography>
                </Stack>

                <Stack>
                  <Typography>APY Rate</Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {financialDetail?.overview?.apyRate} %
                  </Typography>
                </Stack>

                <Stack flexDirection="row" spacing={1}>
                  <Typography>Minimum Financing:</Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {formatCurrency(financialDetail?.overview?.minimumFinancingAmt)}
                  </Typography>
                </Stack>

                <Stack flexDirection="row" spacing={1}>
                  <Typography>Maximum Financing:</Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {formatCurrency(financialDetail?.overview?.maximumFinancingAmt)}
                  </Typography>
                </Stack>

                <Stack flexDirection="row" spacing={1}>
                  <Typography>Early withdraw fee:</Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {formatCurrency(financialDetail?.overview?.earlyWithdrawFee)}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" spacing={1}>
                  
                  <Button variant="contained" color="primary" onClick={handleSelectWallet} disabled={loading} sx={{
            borderRadius: '50px',
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 1,
            paddingBottom: 1,
            marginRight: 1,
        }}>
                    Invest Now
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid sm={12} md={4}>
            <Card sx={{ p: 3, mt: 1 }}>
              <Typography variant="h6" gutterBottom>
                Network Stats
              </Typography>
              <br />
              <Stack flexDirection="column" justifyContent="space-between" spacing={2}>
                <Stack flexDirection="row" gap={1}>
                  <Avatar color="primary">
                    <Iconify icon="solar:dollar-line-duotone"/>
                  </Avatar>
                  <Stack>
                    <Typography variant="subtitle1">
                      {formatCurrency(financialDetail?.overview?.loanAmount)}
                    </Typography>
                    <Typography variant="overline" display="block" gutterBottom>
                      Loan Amount
                    </Typography>
                  </Stack>
                </Stack>

                {/* <Stack flexDirection="row" gap={1}>
          <Iconify icon="fa6-solid:hand-holding-dollar"  />
          <Stack>
            <Typography variant="subtitle1">0 USD</Typography>
            <Typography variant="overline" display="block" gutterBottom>
              Available Pool Value
            </Typography>
          </Stack>
        </Stack>

        <Stack flexDirection="row" gap={1}>
          <Iconify icon="ic:round-lock"  />
          <Stack>
            <Typography variant="subtitle1">5000 USD</Typography>
            <Typography variant="overline" display="block" gutterBottom>
              Total Value Locked
            </Typography>
          </Stack>
        </Stack> */}

                <Stack flexDirection="row" gap={1}>
                  <Avatar color="primary">
                    <Iconify icon="ic:twotone-percentage"/>
                  </Avatar>
                  <Stack>
                    <Typography variant="subtitle1">
                      {financialDetail?.overview?.apyRate} %
                    </Typography>
                    <Typography variant="overline" display="block" gutterBottom>
                      APY
                    </Typography>
                  </Stack>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Avatar color="primary">
                    <Iconify icon="ph:stack-bold"/>
                  </Avatar>
                  <Stack>
                    <Typography variant="subtitle1">{financialDetail?.overview?.rwa}</Typography>
                    <Typography variant="overline" display="block" gutterBottom>
                      Number of Lenders
                    </Typography>
                  </Stack>
                </Stack>

                {/* <Stack flexDirection="row" gap={1}>
          <Avatar color="primary">
            <Iconify icon="hugeicons:profit" />
          </Avatar>
          <Stack>
            <Typography variant="subtitle1">
              {formatCurrency(
                (financialDetail?.overview?.loanAmount *
                  financialDetail?.overview?.apyRate) /
                  100
              )}
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
              Profit
            </Typography>
          </Stack>
        </Stack> */}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog maxWidth="lg" fullWidth open={selectWallet.value} onClose={selectWallet.onFalse}>
        <DialogTitle>Select Wallet</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
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
                    {lenderDetails?.wallet?.map((item, index) => (<TableRow key={index + 1}>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar alt={item?.walletName} src={item?.walletIcon} sx={{ mr: 2 }}/>

                          <ListItemText primary={item.walletName} 
        // secondary={email}
        primaryTypographyProps={{ typography: 'body2' }} secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
            }}/>
                        </TableCell>
                        <TableCell>{item?.walletAddress}</TableCell>
                        <TableCell>
                          <Label color="primary">{item?.walletStatus.toUpperCase()}</Label>
                        </TableCell>
                        <TableCell>
                          <Button disabled={item.walletStatus !== 'whiteList'} variant={item?._id === lendingWallet?._id ? 'contained' : 'outlined'} color="primary" onClick={() => {
                setLendingWallet(item);
            }}>
                            {item?._id === lendingWallet?._id ? 'Selected' : 'Select'}
                          </Button>
                        </TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={!lendingWallet} onClick={handleLendingReq} color="primary" variant="contained">
            Submit
          </Button>
          <Button onClick={handleCloseSelectWallet} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>);
};
export default LenderLendDeal;
