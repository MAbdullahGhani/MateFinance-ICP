export const haqInvoiceMateContractAddress = '0x95c41aA8aAFe1b8744bC9CF638f4734c0fc7f8F1';
export const haqInvoiceNFTAddress = '0x0D5c8057f29CB7e2cCFe6dCCbfC1Ed898e2288F0';
export const haqInvoiceNFTABI = ['function approve(address,uint256)'];

export const haqUsdtAddress = '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd';
export const haqUsdtabi = [
  'function transfer(address,uint256) returns(bool)',
  'function balanceOf(address) view returns(uint256)',
  'function approve(address,uint256) returns(bool)',
  'function allowance(address,address) returns(uint256)',
];
export const haqIdentityRegistryAddress = '0x1Cbfc0169F14e0219D10dF0a888329Aa52093036';
export const haqIdentityRegistryABI = [
  'function registerIdentity(address,address,uint16)',
  'function isVerified(address) view returns(bool)',
];
export const haqIdentityImplementationAuthorityAddress =
  '0x30e3E26E1d204311C35a21CFf94A06FBB3B7ff55';
export const haqClaimIssuerContractAddress = '0x23924872570A39fc049354264AD437AB4C39eDeB';
export const haqTokenAddress = '0x8aDF203Cbfb7625A8B51d0a35D5555118ae7F514';
export const haqTokenABI = ['function burn(address, uint256)', 'function mint(address, uint256)'];
export const haqClaimIssuerPrivateKey =
  '94212e592cf3ddc26bfedb9693f9c597793f6fce4f4434d9686d8840402251bf';
export const haqTokenAgentPrivateKey =
  '2a5631150cd976e276608b833ce61e6d497d163eee5b220f436e6128f5743c0c';
export const haqWalletPrivateKey =
  'b5f923b26452f72582b278045b921d64ed12cb9c98dbd4fa409b8206da1300b8';

export const haqJsonURL = 'https://rpc.eth.haqq.network';
export const haqqChainId = '0x2be3';
// export const jsonURL = "http://127.0.0.1:8545/";
export const haqInvoiceMateContractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'principal',
        type: 'uint256',
      },
    ],
    name: 'LoanApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'currentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
    ],
    name: 'LoanRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'loanRepaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'principal',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'enum HaqqInvoiceMateContract.BorrowerStatus',
        name: 'state',
        type: 'uint8',
      },
    ],
    name: 'stateChanged',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: '_borrowerData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrowCount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isExist',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: '_borrowerLoanDetails',
    outputs: [
      {
        internalType: 'uint256',
        name: 'assignedNFT',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'principalAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'apy',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanStartTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'requestDate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lendId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'tokenURI',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'fundsReceived',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'firozaFinanced',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'repaid',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: '_lenderData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lendCount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isExist',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: '_lenderDetails',
    outputs: [
      {
        internalType: 'uint256',
        name: 'usdcAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lendStartTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'repaymentReciveTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'repaymentRecived',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'claimed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: '_userBorrowStatus',
    outputs: [
      {
        internalType: 'enum HaqqInvoiceMateContract.BorrowerStatus',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_lender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'approveLoan',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'approveLoanFiroza',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'borrowerExist',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'borrowers',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'calculateday',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wallet',
        type: 'address',
      },
    ],
    name: 'changeFirozaWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
      {
        internalType: 'enum HaqqInvoiceMateContract.BorrowerStatus',
        name: '_state',
        type: 'uint8',
      },
    ],
    name: 'changeStateOfLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usdc',
        type: 'address',
      },
    ],
    name: 'changeUsdcAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collectedInvoiceMateFunds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collectedinsurancePoolFunds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentDay',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentState',
    outputs: [
      {
        internalType: 'uint256',
        name: '_incomings',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_outgoinings',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'daysInYear',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'daysInterval',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'erc721',
    outputs: [
      {
        internalType: 'contract IERC721NFT',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'firozaLender',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'getBorrowerLoanDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'assignedNFT',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'principalAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'apy',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanStartTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'requestDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'duration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lendId',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'tokenURI',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'fundsReceived',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'firozaFinanced',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
        ],
        internalType: 'struct HaqqInvoiceMateContract.BorrowerLoanDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'getBorrowerStatus',
    outputs: [
      {
        internalType: 'enum HaqqInvoiceMateContract.BorrowerStatus',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBorrowersLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'getBorrowertotalRepayment',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLendersLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUSDCBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'imFundsReceiver',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_usdc',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ERC721',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_firozaWallet',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_defaultAdmin',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_imFundsReceiver',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'invoiceMatePercentage',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'launch',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'launchTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'lenderExist',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lenderPercentage',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lenders',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'percentDivider',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pool',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolPercentage',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
      {
        internalType: 'enum HaqqInvoiceMateContract.BorrowerStatus',
        name: '_state',
        type: 'uint8',
      },
    ],
    name: 'rejectLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'repayLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_principalAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_loanTerm',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenURI',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_apy',
        type: 'uint256',
      },
    ],
    name: 'requestLoan',
    outputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_imFundsReceiver',
        type: 'address',
      },
    ],
    name: 'setImFundsReceiver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_val1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'val2',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'val3',
        type: 'uint256',
      },
    ],
    name: 'setPercentageMultiplier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pool',
        type: 'address',
      },
    ],
    name: 'setPoolAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updateDay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
    ],
    name: 'whitelistBorrowerAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_lender',
        type: 'address',
      },
    ],
    name: 'whitelistLenderAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawStuckNativeFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawStuckTokenFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
