import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Collapse, Grid, IconButton, ListItemText, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, alpha, } from '@mui/material';
import { fNumber } from 'src/utils/format-number';
import { TableNoData } from 'src/components/table';
import Iconify from 'src/components/iconify/iconify';
import axiosInstance, { endpoints } from 'src/utils/axios';
// import { useSelector } from 'react-redux';
import { varFade } from 'src/components/animate';
import FileThumbnail from 'src/components/file-thumbnail/file-thumbnail';
import { fDate } from 'src/utils/format-time';
// import LoadingSpinner from 'src/components/loading-screen/loading-spinner';
import UserFinanceHistory from './components/user-finance-history';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import RequestOverview from '../financing/invoice-finance-request-overview';
import Approve from '../financing/action-dialogs/Approve';
import Reject from '../financing/action-dialogs/Reject';
import FinanceStatusTimeLine from './finance-status-timeline';
import AdminInvoiceDetails from './AdminInvoiceDetails';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'src/components/snackbar';
export default function RequesterDetailsTab({ financialDetail, userDetail, historyLoading }) {
    console.log('🚀 ~ RequesterDetailsTab ~ financialDetail:', financialDetail);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useSearchParams();
    const [expanded, setExpanded] = useState('');
    const [docsId, setDocsId] = useState([]);
    const [scoreCount, setScoreCount] = useState(0);
    const [loading, setLoading] = useState(0);
    const [openApprove, setOpenApprove] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [state, setState] = useState({
        approvedAmount: '',
        repaymentAmount: '',
        repaymentDate: '',
        financeCost: '',
        interestRate: '',
        externelComments: '',
        internalComments: '',
    });
    // get all document list
    const getDocCSID = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.post(`${endpoints.admin.docCSID}`, {
                organizationType: userDetail.organizationType,
                countryName: userDetail.geoLocation.countryName,
            });
            console.log('🚀 ~ file: financing-credit-score-criteria-list.jsx:308 ~ getDocCSID ~ res:', res);
            setDocsId(res.documentsWithCsId);
            setLoading(false);
        }
        catch (error) {
            console.log('🚀 ~ file: financing-credit-score-criteria-list.jsx:309 ~ getDocCSID ~ error:', error);
            setLoading(false);
        }
    };
    // useEffect(() => {
    //   console.log(
    //     '🚀 ~ file: requester-details-tab.jsx:76 ~ useEffect ~ docsId.documentsWithCsId:',
    //     docsId.documentsWithCsId
    //   );
    //   if (docsId && creditScoreCriteriaList) {
    //     const d = docsId?.reduce((a, b) => {
    //       return a + parseFloat(b?.score);
    //     }, 0);
    //     console.log('🚀 ~ file: requester-details-tab.jsx:79 ~ d ~ d:', d);
    //     const score =
    //       parseFloat(d) +
    //       parseFloat(creditScoreCriteriaList?.minimumDays?.score) +
    //       parseFloat(creditScoreCriteriaList?.filer?.score) +
    //       parseFloat(creditScoreCriteriaList?.postDatedCheque?.score) +
    //       parseFloat(creditScoreCriteriaList?.guarantor?.score) +
    //       parseFloat(creditScoreCriteriaList?.repaymentHistory?.score) +
    //       parseFloat(creditScoreCriteriaList?.biometricVerification?.score);
    //     setScoreCount(score);
    //   }
    // }, [docsId, creditScoreCriteriaList]);
    const handleCollapseChange = (documentType) => {
        console.log('🚀 ~ handleCollapseChange ~ documentType:', documentType);
        setExpanded((prevExpanded) => (prevExpanded === documentType ? '' : documentType));
    };
    function renderDocumentIcons(docs, docType) {
        const filteredDocs = docs?.filter((document) => document.docType === docType);
        if (filteredDocs.length === 0) {
            return (<MenuItem disabled>
          <Iconify icon="ic:baseline-clear" sx={{ color: 'red' }}/>
          No documents available
        </MenuItem>);
        }
        return filteredDocs.map((doc, index) => (<MenuItem value={doc.title} key={index} onClick={() => window.open(`${userAttachments.url}${doc.path}${userAttachments.token}`)}>
        {doc.title}
      </MenuItem>));
    }
    function checkType(string) {
        const contentType = string?.includes('base64');
        if (isURL(string)) {
            return 'URL';
        }
        if (contentType) {
            return 'base64';
        }
        return 'empty';
    }
    function isURL(string) {
        return (string.includes('bankstatements') || string.includes('Users') || string.includes('uploads'));
    }
    const viewAttachment = (statement) => {
        const data = checkType(statement) === 'base64' || checkType(statement) === 'empty'
            ? statement
            : `${userAttachments.url}${statement}${userAttachments.token}`;
        const link = document.createElement('a');
        link.href = data;
        link.setAttribute('download', '');
        link.click();
    };
    const handleClose = () => {
        setOpenApprove(false);
        setOpenReject(false);
        setState({
            approvedAmount: '',
            repaymentAmount: '',
            repaymentDate: '',
            financeCost: '',
            interestRate: '',
            remarks: '',
        });
    };
    const handleFinanceAction = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(`${endpoints.app.rejectDeal}`, {
                invoiceMongoId: financialDetail?.invoiceMongoId,
                status: 'rejected',
                externelComments: state.externelComments,
                internalComments: state.internalComments,
                borrowerId: financialDetail?._id,
            });
            setLoading(false);
            handleClose();
            enqueueSnackbar('Request Rejected!');
        }
        catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
            setLoading(false);
        }
    };
    // useEffect(() => {
    //   getDocCSID();
    // }, []);
    return (<>
      {openApprove && (<Approve loading={loading} state={state} setState={setState} 
        // handleFinanceAction={handleFinanceAction}
        handleClose={handleClose}/>)}
      {openReject && (<Reject loading={loading} state={state} setState={setState} handleFinanceAction={handleFinanceAction} handleClose={handleClose}/>)}

      <Grid container spacing={2}>
        {!financialDetail?.isTokenized && (<Stack spacing={2} flexDirection={'row'} justifyContent={'flex-end'} width={1}>
            {' '}
            <LoadingButton color="primary" variant="contained" onClick={() => router.push(`${paths.dashboard.marketPlace.createMarketPlace}?id=${financialDetail?._id}`)}>
              Create Deal
            </LoadingButton>
            <Button onClick={() => setOpenReject(true)} color="secondary" variant="contained">
              Reject
            </Button>
          </Stack>)}
        <Grid item xs={12} md={12}>
          <Card>
            <RequestOverview invoiceData={financialDetail}/>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <AdminInvoiceDetails id={financialDetail?.invoiceMongoId}/>
        </Grid>
      </Grid>
    </>);
}
