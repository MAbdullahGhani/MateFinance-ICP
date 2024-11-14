import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Import the day icon
import NightsStayIcon from '@mui/icons-material/NightsStay'; // Import the night icon
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Import the evening icon
import Brightness5Icon from '@mui/icons-material/Brightness5'; // Import the afternoon icon
import { useAuthContext } from 'src/auth/hooks';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from 'declarations/MateFinance_backend';
import { Principal } from '@dfinity/principal';

const idlFactoryDefa = ({ IDL }) => {
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Tokens = IDL.Nat;
  const Value = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
  });
  const Memo = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat64;
  const TxIndex = IDL.Nat;
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Tokens }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const Result_2 = IDL.Variant({ 'Ok' : TxIndex, 'Err' : TransferError });
  const Allowance = IDL.Record({
    'allowance' : IDL.Nat,
    'expires_at' : IDL.Opt(IDL.Nat64),
  });
  const ApproveError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'AllowanceChanged' : IDL.Record({ 'current_allowance' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'Expired' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const Result_1 = IDL.Variant({ 'Ok' : TxIndex, 'Err' : ApproveError });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Tokens }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const Result = IDL.Variant({ 'Ok' : TxIndex, 'Err' : TransferFromError });
  const Ledger = IDL.Service({
    'canisterId' : IDL.Func([], [IDL.Principal], []),
    'canisterIdQuick' : IDL.Func([], [IDL.Principal], []),
    'icrc1_balance_of' : IDL.Func([Account], [Tokens], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Value))],
        ['query'],
      ),
    'icrc1_minting_account' : IDL.Func([], [IDL.Opt(Account)], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text }))],
        ['query'],
      ),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [Tokens], ['query']),
    'icrc1_transfer' : IDL.Func(
        [
          IDL.Record({
            'to' : Account,
            'fee' : IDL.Opt(Tokens),
            'memo' : IDL.Opt(Memo),
            'from_subaccount' : IDL.Opt(Subaccount),
            'created_at_time' : IDL.Opt(Timestamp),
            'amount' : Tokens,
          }),
        ],
        [Result_2],
        [],
      ),
    'icrc2_allowance' : IDL.Func(
        [IDL.Record({ 'account' : Account, 'spender' : Account })],
        [Allowance],
        ['query'],
      ),
    'icrc2_approve' : IDL.Func(
        [
          IDL.Record({
            'fee' : IDL.Opt(Tokens),
            'memo' : IDL.Opt(Memo),
            'from_subaccount' : IDL.Opt(Subaccount),
            'created_at_time' : IDL.Opt(Timestamp),
            'amount' : IDL.Nat,
            'expected_allowance' : IDL.Opt(IDL.Nat),
            'expires_at' : IDL.Opt(IDL.Nat64),
            'spender' : Account,
          }),
        ],
        [Result_1],
        [],
      ),
    'icrc2_transfer_from' : IDL.Func(
        [
          IDL.Record({
            'to' : Account,
            'fee' : IDL.Opt(Tokens),
            'spender_subaccount' : IDL.Opt(Subaccount),
            'from' : Account,
            'memo' : IDL.Opt(Memo),
            'created_at_time' : IDL.Opt(Timestamp),
            'amount' : Tokens,
          }),
        ],
        [Result],
        [],
      ),
    'installer' : IDL.Func([], [IDL.Principal], ['query']),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
  return Ledger;
};

const WelcomePage = () => {
  const { user, authenticated } = useAuthContext();

  const [timeOfDay, setTimeOfDay] = useState('day'); // Default to day
  const [defaweb, setDefaweb] = useState(null);
  const [internetIdentity, setInternetIdentity] = useState(null);
  const [tokenDetails, setTokenDetails] = useState({
    name: '',
    symbol: '',
    balance: 0,
    principal: ''
  });

  console.log(tokenDetails)

  useEffect(() => {
    const currentTime = new Date().getHours();

    if (currentTime >= 6 && currentTime < 12) {
      setTimeOfDay('morning');
    } else if (currentTime >= 12 && currentTime < 18) {
      setTimeOfDay('afternoon');
    } else if (currentTime >= 18 && currentTime < 20) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
  }, []);

  const getGreetingMessage = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Good Morning';
      case 'afternoon':
        return 'Good Afternoon';
      case 'evening':
        return 'Good Evening';
      case 'night':
        return 'Have a Good Night';
      default:
        return 'Hello 🌞'; // Default case
    }
  };

  const getGreetingIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <WbSunnyIcon />;
      case 'afternoon':
        return <Brightness5Icon />;
      case 'evening':
        return <Brightness4Icon />;
      case 'night':
        return <NightsStayIcon />;
      default:
        return null; // Default case
    }
  };
 
  const handleInternetIdentity = async () => {
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
        canisterId: "br5f7-7uaaa-aaaaa-qaaca-cai",
      }); 
      setInternetIdentity(webapp);

      const _defaweb = Actor.createActor(idlFactoryDefa, {
        agent,
        canisterId: "avqkn-guaaa-aaaaa-qaaea-cai",
      }); 
      setDefaweb(_defaweb);

      const principal = await webapp.whoami();
      const principal2 = await _defaweb.whoami();
      const principalStr = Principal.fromUint8Array(principal._arr).toString();

      const arg = {
        owner: Principal.fromUint8Array(principal._arr),
        subaccount: []
      };

      const balance = await _defaweb.icrc1_balance_of(arg);
      const tokenName = await _defaweb.icrc1_name();
      const tokenSymbol = await _defaweb.icrc1_symbol();
      const tokenDecimals = await _defaweb.icrc1_decimals();
      const formattedBalance = Number(balance) ;

      setTokenDetails({
        name: tokenName,
        symbol: tokenSymbol,
        balance: formattedBalance,
        principal: principalStr
      });

    } catch (error) {
      console.error("Error connecting to Internet Identity:", error);
    }
  };

  return (
    <Container maxWidth="xxl">
      <Typography variant="h4" sx={{ textAlign: 'left' }} color="#69357A">
        Welcome
      </Typography>
      <Typography variant="h2" color="#9E2654">
        {user?.firstName + ' ' + user?.lastName}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          variant="h4"
          sx={{
            textAlign: 'left',
            whiteSpace: 'nowrap',
          }}
          color="#69357A"
        >
          {getGreetingMessage()}
        </Typography>
        {getGreetingIcon()}
      </Stack>

      <Button 
        variant="contained" 
        onClick={handleInternetIdentity}
        sx={{ my: 2 }}
      >
        Connect Internet Identity
      </Button>

      {tokenDetails.name && (
        <Card 
          sx={{ 
            p: 3, 
            mt: 2,
            background: 'linear-gradient(135deg, #69357A 0%, #9E2654 100%)',
            color: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {tokenDetails.name}
              </Typography>
              <Typography 
                variant="h6"
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {tokenDetails.symbol}
              </Typography>
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {tokenDetails.balance.toFixed(6)}
              <Typography component="span" variant="body1" sx={{ ml: 1, opacity: 0.7 }}>
                {tokenDetails.symbol}
              </Typography>
            </Typography>

            <Stack spacing={1}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Principal ID
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '0.85rem',
                  wordBreak: 'break-all',
                  p: 1.5,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              >
                {tokenDetails.principal}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      )}
    </Container>
  );
};

export default WelcomePage;
