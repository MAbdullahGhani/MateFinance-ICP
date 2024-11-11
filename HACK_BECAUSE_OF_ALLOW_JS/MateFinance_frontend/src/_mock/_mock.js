import { sub } from 'date-fns';
import { ASSETS_API } from 'src/config-global';
import { _id, _ages, _roles, _prices, _emails, _ratings, _nativeS, _nativeM, _nativeL, _percents, _booleans, _sentences, _lastNames, _fullNames, _tourNames, _jobTitles, _taskNames, _postTitles, _firstNames, _fullAddress, _companyNames, _productNames, _descriptions, _phoneNumbers, } from './assets';
// ----------------------------------------------------------------------
export const _mock = {
    id: (index) => _id[index],
    time: (index) => sub(new Date(), { days: index, hours: index }),
    boolean: (index) => _booleans[index],
    role: (index) => _roles[index],
    // Text
    taskNames: (index) => _taskNames[index],
    postTitle: (index) => _postTitles[index],
    jobTitle: (index) => _jobTitles[index],
    tourName: (index) => _tourNames[index],
    productName: (index) => _productNames[index],
    sentence: (index) => _sentences[index],
    description: (index) => _descriptions[index],
    // Contact
    email: (index) => _emails[index],
    phoneNumber: (index) => _phoneNumbers[index],
    fullAddress: (index) => _fullAddress[index],
    // Name
    firstName: (index) => _firstNames[index],
    lastName: (index) => _lastNames[index],
    fullName: (index) => _fullNames[index],
    companyName: (index) => _companyNames[index],
    // Number
    number: {
        percent: (index) => _percents[index],
        rating: (index) => _ratings[index],
        age: (index) => _ages[index],
        price: (index) => _prices[index],
        nativeS: (index) => _nativeS[index],
        nativeM: (index) => _nativeM[index],
        nativeL: (index) => _nativeL[index],
    },
    // Image
    image: {
        cover: (index) => `${ASSETS_API}/assets/images/cover/cover_${index + 1}.jpg`,
        avatar: (index) => `${ASSETS_API}/assets/images/avatar/avatar_${index + 1}.jpg`,
        travel: (index) => `${ASSETS_API}/assets/images/travel/travel_${index + 1}.jpg`,
        company: (index) => `${ASSETS_API}/assets/images/company/company_${index + 1}.png`,
        product: (index) => `${ASSETS_API}/assets/images/m_product/product_${index + 1}.jpg`,
        portrait: (index) => `${ASSETS_API}/assets/images/portrait/portrait_${index + 1}.jpg`,
    },
    lendingBorrowingABI: [
        {
            inputs: [{ internalType: 'address', name: '_mainContract', type: 'address' }],
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
                { indexed: true, internalType: 'uint256', name: 'loanAmount', type: 'uint256' },
                { indexed: true, internalType: 'uint256', name: 'loanPeriod', type: 'uint256' },
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
            inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
            name: 'approveloan',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'borrowerDetails',
            outputs: [
                { internalType: 'uint256', name: 'id', type: 'uint256' },
                { internalType: 'address', name: 'borrower', type: 'address' },
                { internalType: 'uint256', name: 'principal', type: 'uint256' },
                { internalType: 'uint256', name: 'interest', type: 'uint256' },
                { internalType: 'uint256', name: 'loanTerm', type: 'uint256' },
                { internalType: 'uint256', name: 'loanStartDate', type: 'uint256' },
                { internalType: 'uint256', name: 'loanMaturityDate', type: 'uint256' },
                { internalType: 'uint256', name: 'lastRepaidTime', type: 'uint256' },
                { internalType: 'uint256', name: 'paymentsPaid', type: 'uint256' },
                { internalType: 'uint256', name: 'totalPayments', type: 'uint256' },
                { internalType: 'string', name: 'tokenURI', type: 'string' },
                { internalType: 'bool', name: 'fundsReceived', type: 'bool' },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
            name: 'borrowerExist',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'borrowerId',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'borrowerStatus',
            outputs: [{ internalType: 'enum lendingBorrowing.BorrowerStatus', name: '', type: 'uint8' }],
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
            inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
            name: 'calculateLoanRepaymentAmount',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
            name: 'calculateLoanRepaymentTime',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_lender', type: 'address' }],
            name: 'claimFunds',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: '_lender', type: 'address' },
                { internalType: 'uint256', name: '_usdtAmount', type: 'uint256' },
                { internalType: 'address', name: '_borrower', type: 'address' },
            ],
            name: 'depositFunds',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'divider',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
            name: 'getBorrowerDetails',
            outputs: [
                {
                    components: [
                        { internalType: 'uint256', name: 'id', type: 'uint256' },
                        { internalType: 'address', name: 'borrower', type: 'address' },
                        { internalType: 'uint256', name: 'principal', type: 'uint256' },
                        { internalType: 'uint256', name: 'interest', type: 'uint256' },
                        { internalType: 'uint256', name: 'loanTerm', type: 'uint256' },
                        { internalType: 'uint256', name: 'loanStartDate', type: 'uint256' },
                        { internalType: 'uint256', name: 'loanMaturityDate', type: 'uint256' },
                        { internalType: 'uint256', name: 'lastRepaidTime', type: 'uint256' },
                        { internalType: 'uint256', name: 'paymentsPaid', type: 'uint256' },
                        { internalType: 'uint256', name: 'totalPayments', type: 'uint256' },
                        { internalType: 'string', name: 'tokenURI', type: 'string' },
                        { internalType: 'bool', name: 'fundsReceived', type: 'bool' },
                    ],
                    internalType: 'struct lendingBorrowing.BorrowerDetails',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
            name: 'getBorrowerId',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
            name: 'getBorrowerStatus',
            outputs: [{ internalType: 'string', name: '_status', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_lender', type: 'address' }],
            name: 'getLenderDetails',
            outputs: [
                {
                    components: [
                        { internalType: 'uint256', name: 'id', type: 'uint256' },
                        { internalType: 'address', name: 'lender', type: 'address' },
                        { internalType: 'uint256', name: 'usdtAmount', type: 'uint256' },
                        { internalType: 'uint256', name: 'lendTime', type: 'uint256' },
                        { internalType: 'uint256', name: 'claimTime', type: 'uint256' },
                        { internalType: 'bool', name: 'claimed', type: 'bool' },
                    ],
                    internalType: 'struct lendingBorrowing.LenderDetails',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_lender', type: 'address' }],
            name: 'getLenderToBorrowerId',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'interestPercentage',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'lenderDetails',
            outputs: [
                { internalType: 'uint256', name: 'id', type: 'uint256' },
                { internalType: 'address', name: 'lender', type: 'address' },
                { internalType: 'uint256', name: 'usdtAmount', type: 'uint256' },
                { internalType: 'uint256', name: 'lendTime', type: 'uint256' },
                { internalType: 'uint256', name: 'claimTime', type: 'uint256' },
                { internalType: 'bool', name: 'claimed', type: 'bool' },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: '_lender', type: 'address' }],
            name: 'lenderExist',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            name: 'lenders',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'mainContract',
            outputs: [{ internalType: 'contract MainContract', name: '', type: 'address' }],
            stateMutability: 'view',
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
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: '_borrower', type: 'address' },
                { internalType: 'uint256', name: '_amount', type: 'uint256' },
            ],
            name: 'repayLoan',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: '_borrower', type: 'address' },
                { internalType: 'enum lendingBorrowing.BorrowerStatus', name: '_status', type: 'uint8' },
            ],
            name: 'setBorrowerStatus',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: '_borrower', type: 'address' },
                { internalType: 'uint256', name: '_principal', type: 'uint256' },
                { internalType: 'uint256', name: '_loanTerm', type: 'uint256' },
                { internalType: 'string', name: '_tokenURI', type: 'string' },
            ],
            name: 'storeBorrowerDetails',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: '_lender', type: 'address' },
                { internalType: 'uint256', name: '_usdtAmount', type: 'uint256' },
                { internalType: 'address', name: '_borrower', type: 'address' },
            ],
            name: 'storeLenderDetailsAndMintTokens',
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
        {
            inputs: [],
            name: 'yieldPercentage',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
    ],
};
