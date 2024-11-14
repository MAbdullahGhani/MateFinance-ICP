import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import { MenuItem } from '@mui/material';
import axios from 'axios';
import { ethers } from 'ethers';
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFUpload,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ATTACHMENT_TOKEN, ATTACHMENT_URL, IM_HOST_API } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
import { idlFactory } from 'declarations/MateFinance_backend';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

// ----------------------------------------------------------------------

export default function DealNewEditForm({ currentJob }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const urlSearchParams = new URLSearchParams(window.location.search);

  const id = urlSearchParams.get('id');
  const edit = urlSearchParams.get('edit');

  const NewDealSchema = Yup.object().shape({
    loanAmount: Yup.number().min(1, 'Loan amount is required'),
    apyRate: Yup.number().min(1, 'interest is required'),
    rwa: Yup.number(),
    assetType: Yup.string(),
    settlementCycle: Yup.string(),
    minimumFinancingAmt: Yup.number().min(1, 'Amount not zero'),
    maximumFinancingAmt: Yup.number().min(1, 'Amount not zero'),
    earlyWithdrawFee: Yup.number().min(1, 'Amount not zero'),
    loanTenure: Yup.string().required('Tenure is required'),
    dealExpiresIn: Yup.string(),
    blockchainNetwork: Yup.string(),
    chain: Yup.string().required('Chain is required'),
    kyiLink: Yup.string()
      .nullable()
      .test(
        'is-valid-url-or-empty',
        'Enter correct URL!',
        (value) =>
          !value ||
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i.test(value)
      ),
    name: Yup.string(),
    summary: Yup.string(),
    websiteLink: Yup.string()
      .nullable()
      .test(
        'is-valid-url-or-empty',
        'Enter correct URL!',
        (value) =>
          !value ||
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i.test(value)
      ),
    linkedinLink: Yup.string()
      .nullable()
      .test(
        'is-valid-url-or-empty',
        'Enter correct URL!',
        (value) =>
          !value ||
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i.test(value)
      ),
    twitterLink: Yup.string()
      .nullable()
      .test(
        'is-valid-url-or-empty',
        'Enter correct URL!',
        (value) =>
          !value ||
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i.test(value)
      ),
    loanSummary: Yup.string(),
    logo: Yup.string(),
    underWName: Yup.string(),
    underWLink: Yup.string(),
    borrowerWallet: Yup.string().required(),
    isFirozaAPI: Yup.boolean(),
    liquidityPool: Yup.string().required(),
    kyiScore: Yup.number().min(1, 'KYI score is required'),
  });

  const defaultValues = useMemo(
    () => ({
      loanAmount: 0,
      apyRate: 0,
      rwa: 1,
      assetType: 'Invoice Financing',
      loanTenure: '',
      dealExpiresIn: '',
      blockchainNetwork: 'Arbitrum Network',
      kyiLink: '',
      loanSummary: '',
      settlementCycle: 'End of loan term',
      minimumFinancingAmt: 0,
      maximumFinancingAmt: 0,
      earlyWithdrawFee: 0,
      name: '',
      summary: '',
      websiteLink: '',
      linkedinLink: '',
      twitterLink: '',
      logo: '',
      underWName: '',
      underWLink: '',
      isFirozaAPI: false,
      chain: '',
      borrowerWallet: '',
      liquidityPool: '',
      kyiScore: 1,
    }),
    [currentJob]
  );

  const methods = useForm({
    resolver: yupResolver(NewDealSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { user, authenticated } = useAuthContext();

  const [logoUpload, setLogoUpload] = useState('');

  // Define loading state for each button
  const [loading, setLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [financialDetail, setFinancialDetail] = useState(null);
  const [invoiceURI, setInvoiceURI] = useState('');

  const chains = [
    {
      name: 'Arbitrum Network',
      value: 'Arbitrum Network',
    },
    {
      name: 'Haqq Network',
      value: 'Haqq Network',
    },
  ];

  useEffect(() => {
    if (currentJob) {
      reset(defaultValues);
    }
    if (edit) {
      getDeal();
    } else {
      getFinancialData();
    }
  }, [currentJob, defaultValues, reset]);

  const getDeal = async () => {
    setLoading(false);
    try {
      const response = await axiosInstance.get(`${endpoints.app.getDealById}/${id}`);
      const deal = response[0];
      setFinancialDetail(deal);
      setValue('loanAmount', deal?.overview?.loanAmount);
      setValue('apyRate', deal?.overview?.apyRate);
      setValue('rwa', deal?.overview?.rwa);
      setValue('loanSummary', deal?.overview?.loanSummary);
      setValue('assetType', deal?.overview?.assetType);
      setValue('settlementCycle', deal?.overview?.settlementCycle);
      setValue('minimumFinancingAmt', deal?.overview?.minimumFinancingAmt);
      setValue('maximumFinancingAmt', deal?.overview?.maximumFinancingAmt);
      setValue('earlyWithdrawFee', deal?.overview?.earlyWithdrawFee);
      setValue('loanTenure', deal?.overview?.loanTenure);
      setValue('dealExpiresIn', deal?.overview?.dealExpiresIn);
      setValue('blockchainNetwork', deal?.overview?.blockchainNetwork);
      setValue('chain', deal?.overview?.chain);
      setValue('name', deal?.borrower?.name);
      setValue('summary', deal?.borrower?.summary);
      setValue('websiteLink', deal?.borrower?.websiteLink);
      setValue('linkedinLink', deal?.borrower?.linkedinLink);
      setValue('twitterLink', deal?.borrower?.twitterLink);
      setValue('underWName', deal?.underwriter?.underWName);
      setValue('underWLink', deal?.underwriter?.underWLink);
      setValue('kyiLink', deal?.riskMitigation?.kyiLink);
      setValue('liquidityPool', deal?.overview?.liquidityPool);
      setValue('kyiScore', deal?.kyiScore);
      if (deal?.borrower?.logo.length > 0) {
        let file = {
          attachmentTitle: deal?.borrower?.logo[0]?.attachmentTitle,
          base64: deal?.borrower?.logo[0]?.attachmentPath,
          name: deal?.borrower?.logo[0]?.attachmentTitle,
          type: deal?.borrower?.logo[0]?.type,
        };
        setValue(
          'logo',
          ATTACHMENT_URL + deal?.borrower?.logo[0]?.attachmentPath + ATTACHMENT_TOKEN
        );
        setLogoUpload(file);
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setLoading(false);
    }
  };

  const getFinancialData = async () => {
    setLoading(false);
    try {
      const response = await axiosInstance.get(`${endpoints.app.getBorrowerById}/${id}`);
      if (response?.principal && response?.currency !== 'USD') {
        getExtConversionRate('USD', response?.currency, response?.principal);
      } else if (response?.principal) {
        setValue('loanAmount', response?.principal);
        // setConversionAmt(response?.principal);
      }
      setFinancialDetail(response);
      setValue('borrowerWallet', response?.wallets[0]?.walletAddress);
      setValue('name', response?.fullName);
      setValue('blockchainNetwork', response?.chainId);
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setLoading(false);
    }
  };

  // GET Conversion Rate Without Login
  const getExtConversionRate = async (code, invCurr, totalAmt) => {
    const data = { into: code, currencyCode: invCurr };
    try {
      const response = await axiosInstance.post(
        `${IM_HOST_API}/invoices/convertCurrencyWithoutLogin`,
        data
      );
      let n1 = Number(totalAmt);
      let n2 = Number(totalAmt) / response;
      let n3 = Math.round(Number(totalAmt) / response);

      setValue('loanAmount', Math.round(Number(totalAmt) / response));
      // setConversionAmt(Number(totalAmt) / response);
    } catch (error) {
      console.error('Error:', error);
      // handle the error
      enqueueSnackbar(error);
    }
  };

  const handleDrop = (acceptedFiles, name) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const dataURL = reader.result; // The base64 encoded image

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        dataURL, // Add the base64 encoded image to the newFile object
      });

      if (file) {
        setValue(name, newFile, { shouldValidate: true });
        setLogoUpload({
          attachmentTitle: file?.name,
          base64: file?.dataURL,
          name: file?.name,
          type: file?.type,
        });
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (name) => {
    setValue('logo', '', { shouldValidate: true });
    setLogoUpload('');
  };

  const convertDaysToMonths = (daysString) => {
    const daysNumber = parseInt(daysString.split(' ')[0]); // Extracting the number of days from the string
    // return Math.floor(daysNumber / 30); // Assuming a month has 30 days
    return daysNumber;
  };

 
  let returnBlockChainId = '';

  // FOR SMART CONTRACT FUNCTION CALLING
  const storeBorrowerDetails = async (data) => {
    // const { haqq, arbitrum } = user;

    // let check = values.chain === 'Haqq Network';


    // await window.ethereum.request({
    //   method: 'wallet_switchEthereumChain',
    //   params: [{ chainId: check ? haqq?.haqqChainId : arbitrum?.haqqChainId }], //chainId must be in hexadecimal numbers
    // });

    // const _walletPrivateKey = check ? haqq?.walletPrivateKey : arbitrum?.walletPrivateKey;
    // const _invoiceMateContract = check
    //   ? haqq?.InvoiceMateContractAddress
    //   : arbitrum?.InvoiceMateContractAddress; // Replace with your contract address
    // Create ethers wallet instance using private key
    // const wallet = new ethers.Wallet(_walletPrivateKey);

    // Create provider
    // const provider = new ethers.providers.JsonRpcProvider(
    //   check ? haqq?.jsonURL : arbitrum?.jsonURL
    // );

    // Use wallet to connect to provider
    // const deployer = wallet.connect(provider);
    // const borrower = data?.borrowerWallet;
    // const invoiceMateContract = new ethers.Contract(
    //   _invoiceMateContract,
    //   check ? haqq?.InvoiceMateContractABI : arbitrum?.InvoiceMateContractABI,
    //   deployer
    // );
    const principleAmt = 1000000 * data?.loanAmount;
    try {
      let iiUrl = '';
      if (process.env.DFX_NETWORK === "local") {
        iiUrl = `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`;
      } else if (process.env.DFX_NETWORK === "ic") {
        iiUrl = `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.ic0.app`;
      } else {
        iiUrl = `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.dfinity.network`;
      }

      const authClient = await AuthClient.create();

      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: iiUrl,
          onSuccess: resolve,
          onError: reject,
        });
      });

      const identity = authClient.getIdentity();
      const agent = new HttpAgent({ identity });
      await agent.fetchRootKey();

      const webapp = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.CANISTER_ID_MATEFINANCE_BACKEND,
      });

      const principal = await webapp.whoami();
      console.log(Principal.fromUint8Array(principal._arr).toString());
      const arg = {
        owner: Principal.fromUint8Array(principal._arr),
        subaccount: []
      };

      const inintArg = {
        pool: {
          owner: Principal.fromText("cqmja-aix6l-o2mnj-fw5m7-vcq3a-jx27l-grb3e-ll5e7-s3hyn-seoib-xqe"),
          subaccount: []
        },
        usdc: Principal.fromText("a4tbr-q4aaa-aaaaa-qaafq-cai") ,
        defaultAdmin: arg,
        imfundsReceiver: {
          owner: Principal.fromText("cqmja-aix6l-o2mnj-fw5m7-vcq3a-jx27l-grb3e-ll5e7-s3hyn-seoib-xqe"),
          subaccount: []
        },
        defa: Principal.fromText("avqkn-guaaa-aaaaa-qaaea-cai")
      }

      const initiliaze  = await webapp.initialize(inintArg);
      if(initiliaze.err){
        console.log("initialize", initiliaze.err);
        throw new Error(initiliaze.err);
      }
      // Whitelist borrower address
      const whitelistResult = await webapp._whitelistBorrowerAddress(arg);
      if (whitelistResult.err) {
        console.log(whitelistResult.err);
        throw new Error(whitelistResult.err);
      }

      // Request loan
      const requestLoanResult = await webapp.requestLoan(
        arg,
        BigInt(principleAmt),
        BigInt(convertDaysToMonths(data?.loanTenure)),
        "https://www.google.com",
        BigInt(data?.apyRate)
      );

      if (requestLoanResult.err) {
        throw new Error(requestLoanResult.err);
      }

      const [loanId, borrowerPrincipal] = requestLoanResult.ok;
      returnBlockChainId = Number(loanId);
      // const txn = await invoiceMateContract.connect(deployer).whitelistBorrowerAddress(borrower);
      // await txn.wait();
      // const tx = await invoiceMateContract.connect(deployer).requestLoan(
      //   borrower,
      //   principleAmt, // principle
      //   convertDaysToMonths(data?.loanTenure), //loan term months
      //   invoiceUri,
      //   data?.apyRate
      // );
      // const receipt = await tx.wait();
      // console.log(receipt);
      // if (receipt.status === 1) {
        // Extract the returned ID from the transaction receipt
        // const returnedId = receipt.events[0].args.currentId.toNumber();
        // console.log('Returned ID:', returnedId);
        // returnBlockChainId = returnedId;
        // let result = await invoiceMateContract.getBorrowerLoanDetails(borrower, returnedId);
        // console.log(result);
        // return result.tokenURI;
        // Create a new pool on invoiceMate
        let payload = {
          ...data,
          _id: id || '',
          logo: logoUpload ? [logoUpload] : [],
          status: 'tokenized',
          borrowerID: financialDetail?._id,
          invoiceMongoId: financialDetail?.invoiceMongoId,
          // returnBlockChainId: returnBlockChainId,
        };
        await axiosInstance.post(
          edit !== 'true' ? endpoints.app.createDeal : endpoints.app.updateDeal,
          {
            ...payload,
          }
          );
      setIsCreatingPool(false);
      enqueueSnackbar('Deal Created Successfully');
      router.push(paths.dashboard.marketPlace.marketPlaceList);
      // } else {
      //   console.error('Transaction failed:', receipt);
      // }
    } catch (err) {
      console.error('Error:', err);
      enqueueSnackbar(err, {
        variant: 'error',
      });
      setIsCreatingPool(false);
    }
  };

  const onSubmit = handleSubmit(async (data, event) => {
    let isHaqNetwork = data.chain === 'Haqq Network';

    if (Number(data?.minimumFinancingAmt) < data?.loanAmount) {
      enqueueSnackbar('Minimum financing amount not less than loan amount.', {
        variant: 'error',
      });
      return;
    }
    if (Number(data?.maximumFinancingAmt) > data?.loanAmount) {
      enqueueSnackbar('Maximum financing amount not greater than loan amount.', {
        variant: 'error',
      });
      return;
    }
    if (Number(data?.earlyWithdrawFee) > data?.loanAmount) {
      enqueueSnackbar('Early withdraw fee not greater than loan amount.', {
        variant: 'error',
      });
      return;
    }

    // Prevent the default form submission behaviorr
    event.preventDefault();

    // Check which button was clicked based on its name or value
    const buttonClicked = event.nativeEvent.submitter;

    // Perform different actions based on the clicked buttonn
    if (buttonClicked && buttonClicked.name === 'saveDraft') {
      try {
        setIsSavingDraft(true);
        let payload = {
          ...data,
          logo: logoUpload ? [logoUpload] : [],
          status: 'draft',
          borrowerID: financialDetail?._id,
          invoiceMongoId: financialDetail?.invoiceMongoId,
        };
        await axiosInstance.post(endpoints.app.createDeal, payload);
        enqueueSnackbar('Deal Save Draft Successfully');
        setIsSavingDraft(false);
        router.push(paths.dashboard.marketPlace.marketPlaceList);
      } catch (error) {
        setIsSavingDraft(false);
        enqueueSnackbar(error, {
          variant: 'error',
        });
      }
    } else if (buttonClicked && buttonClicked.name === 'createPool') {
      try {
        setIsCreatingPool(true);
        if (isHaqNetwork) {
          // Integrate invoiceMate Smart Contract
          await storeBorrowerDetails(data);
          // Create a new pool on Firoza API if the deal is created on Haqq Network and Firoza API is enabled
          if (data?.isFirozaAPI) {
          }
        } else {
          // Integrate invoiceMate Smart Contract
          const tokenURI = await storeBorrowerDetails(data);
        }
      } catch (error) {
        setIsCreatingPool(false);
        enqueueSnackbar(error?.error?.reason || error || 'Server Error!', {
          variant: 'error',
        });
      }
    }
  });

  const calculateDate = (data, type) => {
    if (type === 'dueDate') {
      const days = parseInt(data?.loanTenure.split(' ')[0], 10);
      const start = new Date();
      const due = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
      return due.toISOString(); // Use toISOString for the desired format
    } else {
      const days = parseInt(data?.dealExpiresIn.split(' ')[0], 10);
      return days;
    }
  };

  const createDealWithFeroza = async (payload) => {
    try {
    } catch (error) {
      throw new Error(error);
    }
  };

  const renderOverView = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Overview
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Loan Amount, APY, Tenure...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Overview" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="loanAmount"
                label="Loan Amount"
                type="number"
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <small>USD</small>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField name="apyRate" label="APY Rate %" type="number" />
              <RHFTextField disabled name="rwa" label="RWA" type="number" />
              {/* <RHFTextField name="interest" label="Markup" type="number" /> */}
              {/* <RHFTextField name="total" label="Total" type="number" /> */}
              {/* <RHFTextField name="totalPoolAsset" label="Total Pool Asset" type="number" /> */}
              <RHFSelect name="loanTenure" label="Loan Tenure">
                {['15 Days', '30 Days', '45 Days', '60 Days', '75 Days', '90 Days', '120 Days'].map(
                  (deal) => (
                    <MenuItem value={deal} key={deal}>
                      {deal}
                    </MenuItem>
                  )
                )}
              </RHFSelect>
              <RHFSelect name="settlementCycle" label="Settlement cycle">
                {['End of loan term'].map((deal) => (
                  <MenuItem value={deal} key={deal}>
                    {deal}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="dealExpiresIn" label="Deal Expires In">
                {['5 Days', '10 Days', '15 Days', '20 Days', '25 Days', '30 Days'].map((deal) => (
                  <MenuItem value={deal} key={deal}>
                    {deal}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField
                type="number"
                name="minimumFinancingAmt"
                label="Financing Amt. (Min)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <small>USD</small>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                type="number"
                name="maximumFinancingAmt"
                label="Financing Amt. (Max)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <small>USD</small>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                type="number"
                name="earlyWithdrawFee"
                label="Early Withdraw Fee"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <small>USD</small>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFSelect name="chain" label="Select Chain">
                {chains.map((chain) => (
                  <MenuItem value={chain.value} key={chain.value}>
                    {chain.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="liquidityPool" label="Liquidity Pool">
                {['High Risk Pool', 'Low Risk Pool'].map((pool) => (
                  <MenuItem value={pool} key={pool}>
                    {pool}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField disabled name="assetType" label="Asset Type" />
              <RHFTextField disabled name="blockchainNetwork" label="Borrower Chain" />
            </Box>
            <RHFTextField
              name="loanSummary"
              label="Loan Summary"
              multiline
              rows={4}
              inputProps={{ maxLength: 500 }}
              InputProps={{
                endAdornment: (
                  <div
                    style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.54)', alignSelf: 'end' }}
                  >
                    {values.loanSummary.length}/{500}
                  </div>
                ),
              }}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderHighLights = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            HighLights
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional details...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="HighLights" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="highLights" label="HighLights" multiline rows={4} />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderAnalysis = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Analysis
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Credit expert information...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Analysis" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="summary" label="Summary of credit expert" multiline rows={4} />
            <RHFTextField name="details" label="Review about borrower" multiline rows={4} />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderRepayment = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Repayments
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Loan terms, term start date...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Repayments" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="loanTerms" label="Loan Terms" />
            <RHFTextField
              name="loanStartDate"
              label="Loan Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            {/* <RHFTextField
              name="loanMaturityDate"
              label="Loan Maturity Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            /> */}
            <RHFTextField name="repaymentStructure" label="Payment Frequency" />
            <RHFTextField name="totalPayments" label="Total Payments" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderBorrower = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Borrower
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Borrower information...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Borrower" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="borrowerWallet" label="Borrower Wallet" />
            <RHFTextField name="summary" label="Summary" multiline rows={4} />
            <RHFTextField
              name="websiteLink"
              label="Website Link"
              InputProps={{
                startAdornment: <InputAdornment position="start">https://</InputAdornment>,
              }}
            />
            <RHFTextField
              name="linkedinLink"
              label="LinkedIn Link"
              InputProps={{
                startAdornment: <InputAdornment position="start">https://</InputAdornment>,
              }}
            />
            <RHFTextField
              name="twitterLink"
              label="Twitter Link"
              InputProps={{
                startAdornment: <InputAdornment position="start">https://</InputAdornment>,
              }}
            />
            <Stack flexDirection="column" spacing={2}>
              <small>Upload Logo</small>
              <Stack flexDirection="row" spacing={2}>
                <RHFUploadAvatar
                  name="logo"
                  maxSize={3145728}
                  onDrop={(file) => handleDrop(file, 'logo')}
                  onDelete={() => handleRemoveFile('logo')}
                  disabled
                />
                <RHFUpload
                  name="logo"
                  maxSize={3145728}
                  onDrop={(file) => handleDrop(file, 'logo')}
                  onDelete={() => handleRemoveFile('logo')}
                />
                {/* {values.logo && (
                  <Box
                    sx={{
                      m: 0.5,
                      width: 100,
                      height: 107,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 1,
                      cursor: 'pointer',
                      alignItems: 'center',
                      color: 'text.disabled',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                      border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                    }}
                  >
                    <Iconify icon="iconamoon:attachment-duotone" width={28} />
                    <Typography>{values?.logo?.name?.substring(0, 10)}</Typography>
                    <Typography variant="caption">{values?.logo?.type}</Typography>
                    <Box sx={{ justifyContent: 'space-between' }}>
                      <IconButton>
                        <Iconify
                          sx={{ color: 'error.main' }}
                          icon="solar:trash-bin-trash-bold"
                          onClick={() => handleRemoveFile('logo')}
                          width={18}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                )} */}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderRiskMitigation = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Risk Mitigation
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            KYI Link...
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Risk Mitigation" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="kyiLink"
              label="KYI Link"
              InputProps={{
                startAdornment: <InputAdornment position="start">https://</InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        const websiteLink = values.kyiLink;
                        if (websiteLink) {
                          const modifiedLink = websiteLink.startsWith('https://')
                            ? websiteLink
                            : `https://${websiteLink}`;
                          window.open(modifiedLink);
                        }
                      }}
                      edge="end"
                    >
                      <Iconify icon="bi:browser-edge" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField name="kyiScore" label="KYI Score" type="number" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderUnderWriter = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Underwriter
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Name, link...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Underwriter" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="underWName" label="Name" />
            <RHFTextField
              name="underWLink"
              label="Website Link"
              InputProps={{
                startAdornment: <InputAdornment position="start">https://</InputAdornment>,
              }}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && values.chain === 'Haqq Network' && (
        <Grid md={6}>
          <RHFCheckbox name="isFirozaAPI" label="Do you want to manually transfer funds?" />
        </Grid>
      )}
      {mdUp && values.chain !== 'Haqq Network' && <Grid md={6} />}
      <Grid
        xs={12}
        md={6}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
      >
        <LoadingButton
          loading={isSavingDraft}
          variant="outlined"
          sx={{
            height: '100%',
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 1,
            paddingBottom: 1,
            background: 'white',
            borderRadius: 3,
            border: '1px #C3D4E9 solid',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            display: 'inline-flex',
          }}
          type="submit"
          name="saveDraft"
          // onClick={handleSaveDraft}
          disabled={isSavingDraft}
        >
          <div
            style={{
              textAlign: 'center',
              color: '#040815',
              fontSize: 16,
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 400,
              wordWrap: 'break-word',
            }}
          >
            {isSavingDraft ? 'Saving Draft...' : 'Save As Draft'}
          </div>
        </LoadingButton>

        <LoadingButton
          variant="contained"
          sx={{
            height: '100%',
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 1,
            paddingBottom: 1,
            background: '#9E2654',
            borderRadius: 3,
            marginLeft: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            display: 'inline-flex',
          }}
          type="submit"
          name="createPool"
          // onClick={handleCreatePool}
          loading={isCreatingPool}
          disabled={isCreatingPool}
        >
          <div
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 400,
              wordWrap: 'break-word',
            }}
          >
            {isCreatingPool ? 'Creating Pool...' : 'Create Pool'}
          </div>
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderActions}
        {renderOverView}

        {/* {renderHighLights} */}

        {/* {renderAnalysis} */}

        {/* {renderRepayment} */}

        {renderBorrower}

        {renderUnderWriter}

        {renderRiskMitigation}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

DealNewEditForm.propTypes = {
  currentJob: PropTypes.object,
};
