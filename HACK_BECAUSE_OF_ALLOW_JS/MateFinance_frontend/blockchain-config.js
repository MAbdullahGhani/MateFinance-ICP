export const InvoiceMateContractAddress = '0x8A7574bAE87DEB863c974EA7b8c06C54a24bCdf9';
export const InvoiceNFTAddress = '0x1E2406D79A488d5C45c11E5969fFDEbC0fBC9B0c';
export const InvoiceNFTABI = ['function approve(address,uint256)'];
export const usdtAddress = '0x5042Fce7B7c2F8aD28973993E97ac9BD982327D3';
export const usdtabi = [
    'function transfer(address,uint256) returns(bool)',
    'function balanceOf(address) view returns(uint256)',
    'function approve(address,uint256) returns(bool)',
    'function allowance(address,address) returns(uint256)',
];
export const identityRegistryAddress = '0xA70A99E5C8a7d611e8b1482D1c3B6fC7e8805F7D';
export const identityRegistryABI = [
    'function registerIdentity(address,address,uint16)',
    'function isVerified(address) view returns(bool)',
];
export const identityImplementationAuthorityAddress = '0xEbdDB7a2353a03649cd91b9C5Eb9eB107EA142f3';
export const claimIssuerContractAddress = '0x0689ba8E1749337D2ffC0c21B08Ca05Bd2A97FC8';
export const tokenAddress = '0x75732d122fa18505283114df6a0DB0c3Aeaa2090';
export const tokenABI = ['function burn(address, uint256)', 'function mint(address, uint256)'];
export const claimIssuerPrivateKey = '94212e592cf3ddc26bfedb9693f9c597793f6fce4f4434d9686d8840402251bf';
export const tokenAgentPrivateKey = '2a5631150cd976e276608b833ce61e6d497d163eee5b220f436e6128f5743c0c';
export const walletPrivateKey = 'e8a78114b7d9d2f95d5af3d95068be38781e4c8707cb52c5c7a352a49c2f4c7b';
export const jsonURL = 'https://sepolia-rollup.arbitrum.io/rpc';
// export const jsonURL = "http://127.0.0.1:8545/";
export const InvoiceMateContractABI = [
    {
        inputs: [
            { internalType: 'address', name: '_USDT', type: 'address' },
            { internalType: 'address', name: '_ERC721', type: 'address' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'principal', type: 'uint256' },
            { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
        ],
        name: 'LoanApproved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'principal', type: 'uint256' },
            { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
        ],
        name: 'LoanRejected',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'currentId', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'loanAmount', type: 'uint256' },
        ],
        name: 'LoanRequested',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'lender', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'usdtAmount', type: 'uint256' },
            { indexed: true, internalType: 'uint256', name: 'lenderToBorrowerId', type: 'uint256' },
        ],
        name: 'fundsApproved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'lender', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'usdtAmount', type: 'uint256' },
        ],
        name: 'fundsClaimed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'lender', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'usdtAmount', type: 'uint256' },
            { indexed: true, internalType: 'uint256', name: 'lenderToBorrowerId', type: 'uint256' },
        ],
        name: 'fundsDeposited',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'loanAmount', type: 'uint256' },
            { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
        ],
        name: 'loanRepaid',
        type: 'event',
    },
    {
        inputs: [],
        name: 'USDT',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: '_borrowerData',
        outputs: [
            { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
            { internalType: 'uint256', name: 'borrowCount', type: 'uint256' },
            { internalType: 'bool', name: 'isExist', type: 'bool' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        name: '_borrowerLoanDetails',
        outputs: [
            { internalType: 'uint256', name: 'assignedNFT', type: 'uint256' },
            { internalType: 'address', name: 'lender', type: 'address' },
            { internalType: 'uint256', name: 'principalAmount', type: 'uint256' },
            { internalType: 'uint256', name: 'interestRate', type: 'uint256' },
            { internalType: 'uint256', name: 'loanTerm', type: 'uint256' },
            { internalType: 'uint256', name: 'loanStartDate', type: 'uint256' },
            { internalType: 'uint256', name: 'loanMaturityDate', type: 'uint256' },
            { internalType: 'uint256', name: 'lendId', type: 'uint256' },
            { internalType: 'bool', name: 'repaid', type: 'bool' },
            { internalType: 'bool', name: 'approved', type: 'bool' },
            { internalType: 'string', name: 'tokenURI', type: 'string' },
            { internalType: 'bool', name: 'fundsReceived', type: 'bool' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: '_lenderData',
        outputs: [
            { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
            { internalType: 'uint256', name: 'lendCount', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        name: '_lenderDetails',
        outputs: [
            { internalType: 'uint256', name: 'usdtAmount', type: 'uint256' },
            { internalType: 'uint256', name: 'lendStartTime', type: 'uint256' },
            { internalType: 'uint256', name: 'claimTime', type: 'uint256' },
            { internalType: 'bool', name: 'claimed', type: 'bool' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        name: '_userBorrowStatus',
        outputs: [{ internalType: 'enum InvoiceMateContract.BorrowerStatus', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
        ],
        name: 'approveloan',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
        name: 'borrowerExist',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'borrowers',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
        name: 'burnNFT',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'calculateday',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '_newLenderYieldPercentage', type: 'uint256' }],
        name: 'changeLenderYieldPercentage',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '_newPlatformFeePercentage', type: 'uint256' }],
        name: 'changePlatformFeePercentage',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_usdt', type: 'address' }],
        name: 'changeUSDT',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '_newWalletPercentage', type: 'uint256' }],
        name: 'changeWalletPercentage',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'currentState',
        outputs: [
            { internalType: 'uint256', name: '_incomings', type: 'uint256' },
            { internalType: 'uint256', name: '_outgoinings', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'daysInYear',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'daysInterval',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_lender', type: 'address' },
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_usdtAmount', type: 'uint256' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
        ],
        name: 'depositFunds',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'erc721',
        outputs: [{ internalType: 'contract IERC721NFT', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
        ],
        name: 'getBorrowerLoanDetails',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'assignedNFT', type: 'uint256' },
                    { internalType: 'address', name: 'lender', type: 'address' },
                    { internalType: 'uint256', name: 'principalAmount', type: 'uint256' },
                    { internalType: 'uint256', name: 'interestRate', type: 'uint256' },
                    { internalType: 'uint256', name: 'loanTerm', type: 'uint256' },
                    { internalType: 'uint256', name: 'loanStartDate', type: 'uint256' },
                    { internalType: 'uint256', name: 'loanMaturityDate', type: 'uint256' },
                    { internalType: 'uint256', name: 'lendId', type: 'uint256' },
                    { internalType: 'bool', name: 'repaid', type: 'bool' },
                    { internalType: 'bool', name: 'approved', type: 'bool' },
                    { internalType: 'string', name: 'tokenURI', type: 'string' },
                    { internalType: 'bool', name: 'fundsReceived', type: 'bool' },
                ],
                internalType: 'struct InvoiceMateContract.BorrowerLoanDetails',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
        ],
        name: 'getBorrowerStatus',
        outputs: [{ internalType: 'enum InvoiceMateContract.BorrowerStatus', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getBorrowersLength',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
        ],
        name: 'getBorrowertotalRepayment',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
        name: 'getUSDTBalance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'lenderToBorrowerId',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'lenderYieldPercentage',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_borrower', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
            { internalType: 'string', name: '_tokenURI', type: 'string' },
        ],
        name: 'mintNFT',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'percentageDivider',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'platformFeePercentage',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
        ],
        name: 'rejectLoan',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
        ],
        name: 'repayLoan',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_from', type: 'address' },
            { internalType: 'address', name: '_to', type: 'address' },
            { internalType: 'uint256', name: '_usdtAmount', type: 'uint256' },
            { internalType: 'uint256', name: '_principal', type: 'uint256' },
        ],
        name: 'repayUSDT',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_borrower', type: 'address' },
            { internalType: 'uint256', name: '_principalAmount', type: 'uint256' },
            { internalType: 'uint256', name: '_loanTerm', type: 'uint256' },
            { internalType: 'string', name: '_tokenURI', type: 'string' },
            { internalType: 'uint256', name: '_interestPercentage', type: 'uint256' },
        ],
        name: 'requestLoan',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
            { internalType: 'enum InvoiceMateContract.BorrowerStatus', name: '_status', type: 'uint8' },
        ],
        name: 'setBorrowerStatus',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_lender', type: 'address' },
            { internalType: 'uint256', name: '_usdtAmount', type: 'uint256' },
            { internalType: 'address', name: '_user', type: 'address' },
            { internalType: 'uint256', name: '_id', type: 'uint256' },
        ],
        name: 'storeLenderDetails',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_to', type: 'address' },
            { internalType: 'uint256', name: '_amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_from', type: 'address' },
            { internalType: 'uint256', name: '_amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { inputs: [], name: 'updateDay', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [],
        name: 'walletPercentage',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'withdrawStuckFunds',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
