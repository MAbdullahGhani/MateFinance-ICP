/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-var */
/* eslint-disable radix */
/* eslint-disable vars-on-top */
import React, { useEffect, useState } from 'react';
// @mui
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Card, Container, Divider, Grid, Paper, Stack, Switch, Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography, alpha, } from '@mui/material';
// Page
// Utils
import { enqueueSnackbar } from 'notistack';
import { useSearchParams } from 'src/routes/hook';
import axios, { endpoints } from 'src/utils/axios';
//
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import axiosInstance from 'src/utils/axios';
import { fNumber } from 'src/utils/format-number';
import FinanceStatusTimeLine from '../invoice/finance-status-timeline';
import Approve from './action-dialogs/Approve';
import Disburse from './action-dialogs/Disburse';
import NeedMore from './action-dialogs/NeedMore';
import Reject from './action-dialogs/Reject';
import Repayment from './action-dialogs/Repayment';
import DocumentList from './documents';
import RequestOverview from './invoice-finance-request-overview';
import FinanceLogs from './logs';
import FinanceKpi from '../admin/financing-profile/components/finance-kpi';
export default function FinanceInvoicesReq() {
    const loading = useBoolean();
    const [userDetail, setUserDetail] = useState({});
    const [financialDetail, setFinancialDetail] = useState({ creditScore: {} });
    const [state, setState] = useState({
        approvedAmount: '',
        repaymentAmount: '',
        repaymentDate: '',
        financeCost: '',
        interestRate: '',
        externelComments: '',
        internalComments: '',
    });
    const [allCreditData, setAllCreditData] = useState([]);
    console.log('🚀 ~ FinanceInvoicesReq ~ allCreditData:', allCreditData);
    const [organizationType, setOrganizationType] = useState('Micro');
    const [countryName, setCountryName] = useState('Pakistan');
    const [value, setValue] = React.useState('1');
    const [showTable, setShowTable] = useState(true);
    const [invoice, setInvoice] = useState({});
    console.log('🚀 ~ FinanceInvoicesReq ~ invoice:', invoice);
    const getFinancialData = () => {
        axiosInstance
            .post(`${endpoints.admin.financeInfo}`, {
            userId: invoice?.invoiceFinanceObj?.requesterId || '',
        })
            .then((res) => {
            console.log('res', res);
            setFinancialDetail(res.user.userFinance);
            setUserDetail(res.user);
            setOrganizationType(userDetail?.organizationType);
            setCountryName(userDetail?.geoLocation?.countryName);
        })
            .catch((err) => {
            console.error('Error fetching financial data:', err);
            enqueueSnackbar('Error fetching financial data', { variant: 'error' });
        });
    };
    const getAllCreditScore = async () => {
        try {
            const res = await axiosInstance.post(`${endpoints.admin.financeCreditScore}`, {
                organizationType,
                countryName,
            });
            console.log('🚀 ~ file: financing-credit-score-criteria-list.jsx:255 ~ getAllCreditScore ~ res:', res);
            setAllCreditData(res[0]);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const data = [
        {
            id: 1,
            name: allCreditData?.basicInfo?.name,
            description: allCreditData?.basicInfo?.description,
            score: 'basicInfoScore',
        },
        {
            id: 2,
            name: allCreditData?.minimumDays?.name,
            description: allCreditData?.minimumDays?.description,
            score: 'minimumDaysScore',
        },
        {
            id: 3,
            name: allCreditData?.filer?.name,
            description: allCreditData?.filer?.description,
            score: 'filerScore',
        },
        {
            id: 4,
            name: allCreditData?.postDatedCheque?.name,
            description: allCreditData?.postDatedCheque?.description,
            score: 'postDatedChequeScore',
        },
        {
            id: 5,
            name: allCreditData?.guarantor?.name,
            description: allCreditData?.guarantor?.description,
            score: 'guarantorScore',
        },
        {
            id: 6,
            name: allCreditData?.repaymentHistory?.name,
            description: allCreditData?.repaymentHistory?.description,
            score: 'repaymentHistoryScore',
        },
        {
            id: 7,
            name: allCreditData?.biometricVerification?.name,
            description: allCreditData?.biometricVerification?.description,
            score: 'biometricVerificationScore',
        },
        { name: 'Total', description: '', score: 'totalCreditScore' },
    ];
    const [openRepayment, setOpenRepayment] = useState(false);
    const [openDisburse, setOpenDisburse] = useState(false);
    const [openApprove, setOpenApprove] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [openNeedMore, setOpenNeedMore] = useState(false);
    const [kpiButton, setKpiButton] = useState(false);
    const [userFinanceKPIs, setUserFinanceKPIs] = useState({});
    console.log('🚀 ~ file: finance-invoice-req.jsx:111 ~ FinanceInvoicesReq ~ userFinanceKPIs:', userFinanceKPIs);
    //   get Param id
    const param = useSearchParams();
    const invoiceId = param.get('ReqId');
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const handleSwitchClick = () => {
        setKpiButton((prevValue) => !prevValue);
    };
    const getFinanceKpis = async () => {
        try {
            const response = await axiosInstance.post(`${endpoints.admin.financeKpiAdmin}`, {
                userId: invoice?.invoiceFinanceObj?.requesterId || '',
            });
            setUserFinanceKPIs(response);
        }
        catch (error) {
            console.log('🚀 ~ file: finance-invoice-req.jsx:127 ~ getFinanceKpis ~ error:', error);
        }
    };
    //   Get Invoice Req
    const getInvoiceById = async () => {
        try {
            const response = await axios.get(endpoints.invoice.getInvoiceById + invoiceId);
            setInvoice(response?.invoice);
        }
        catch (error) {
            enqueueSnackbar(error.toString(), { variant: 'error' });
        }
    };
    useEffect(() => {
        getInvoiceById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (invoice?.invoiceFinanceObj?.requesterId) {
            getFinanceKpis();
            getFinancialData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoice]);
    useEffect(() => {
        if (organizationType && countryName) {
            getAllCreditScore();
        }
    }, [organizationType, countryName]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { t } = useLocales();
    //
    const handleClose = () => {
        setOpenApprove(false);
        setOpenDisburse(false);
        setOpenRepayment(false);
        setOpenNeedMore(false);
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
    // Request Submit
    const send = async (status, inv) => {
        loading.onTrue();
        var bodyFormData = new FormData();
        bodyFormData.append('_id', inv._id);
        bodyFormData.append('action', status);
        bodyFormData.append('approvedAmount', state?.approvedAmount);
        bodyFormData.append('disbursedAmount', state?.disbursedAmount);
        bodyFormData.append('repaymentAmount', state?.repaymentAmount);
        bodyFormData.append('repaymentDate', state?.repaymentDate);
        bodyFormData.append('internalComments', state?.internalComments);
        bodyFormData.append('externelComments', state?.externelComments);
        bodyFormData.append('interestRate', state?.interestRate);
        bodyFormData.append('financeCost', state?.financeCost);
        try {
            const req = await axiosInstance.post(endpoints.admin.applyForFinanceInvoiceAdmin, bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            loading.onFalse();
            handleClose();
            getInvoiceById();
        }
        catch (error) {
            console.log('🚀 ~ send ~ error:', error);
        }
    };
    // Actions Validation
    const handleFinanceAction = async (status, inv) => {
        function checkValues(value, greater) {
            return isNaN(value) || (value >= 0 && value > greater);
        }
        switch (status) {
            case 'Approved':
                if (checkValues(parseInt(state.approvedAmount), parseInt(inv.invoiceFinanceObj.requestAmount))) {
                    enqueueSnackbar('Please Enter Valid Amount', { variant: 'error' });
                }
                else {
                    send(status, inv);
                }
                break;
            case 'Disbursed':
                if (checkValues(parseInt(state.disbursedAmount), parseInt(inv.invoiceFinanceObj.approvedAmount))) {
                    enqueueSnackbar('Please Enter Valid Amount', { variant: 'error' });
                }
                else {
                    send(status, inv);
                }
                break;
            case 'Repayment':
                if (checkValues(parseInt(state.repaymentAmount), parseInt(inv.invoiceFinanceObj.disbursedAmount))) {
                    enqueueSnackbar('Please Enter Valid Amount', { variant: 'error' });
                }
                else {
                    send(status, inv);
                }
                break;
            case 'Correction Required':
                if (!state.externelComments) {
                    enqueueSnackbar('Please Enter Externel Notes', { variant: 'error' });
                }
                else {
                    send(status, inv);
                }
                break;
            case 'Rejected':
                if (!state.externelComments) {
                    enqueueSnackbar('Please Enter Externel Notes', { variant: 'error' });
                }
                else {
                    send(status, inv);
                }
                break;
            default:
                console.log('Selected  is not recognized.');
                break;
        }
    };
    function RepaymentButton() {
        return (<Button onClick={() => setOpenRepayment(true)} color="primary" variant="contained">
        Repayment
      </Button>);
    }
    function DisburseButton() {
        return (<Button onClick={() => setOpenDisburse(true)} color="primary" variant="contained">
        Repayment
      </Button>);
    }
    function DisbursePaymentButton() {
        return (<Button onClick={() => setOpenDisburse(true)} color="primary" variant="contained">
        Disburse Payment
      </Button>);
    }
    function RejectedButton() {
        return (<Button disabled color="secondary" variant="contained">
        Rejected
      </Button>);
    }
    function RepaymentDone() {
        return (<Label sx={{ minHeight: '50px' }} color="success">
        Repayment Done
      </Label>);
    }
    function InProgressButtons() {
        return (<>
        <Button onClick={() => setOpenApprove(true)} color="primary" variant="contained">
          Approve
        </Button>

        <Button onClick={() => setOpenReject(true)} color="secondary" variant="contained">
          Reject
        </Button>
        <Button onClick={() => setOpenNeedMore(true)} color="inherit" variant="contained">
          Need More Detail
        </Button>
      </>);
    }
    function renderConditionalButtons() {
        const financeStatus = invoice?.financeRequestAction;
        console.log('🚀 ~ renderConditionalButtons ~ financeStatus:', financeStatus);
        if (financeStatus === 'Repayment') {
            return <RepaymentDone />;
        }
        if (financeStatus === 'Disbursed') {
            return <RepaymentButton />;
        }
        // if (financeStatus === "Disbursed") {
        //   return <DisburseButton />;
        // }
        if (financeStatus === 'Approved') {
            return <DisbursePaymentButton />;
        }
        if (financeStatus === 'Rejected') {
            return <RejectedButton />;
        }
        if (financeStatus === 'In Progress' || financeStatus === 'Need more details') {
            return <InProgressButtons />;
        }
        return null;
    }
    return (<Container maxWidth="xxl">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography>
          Live Score
          <Switch {...label} defaultChecked={kpiButton} onClick={handleSwitchClick}/>
        </Typography>
      </div>
      <FinanceKpi userFinanceKPIs={kpiButton ? userFinanceKPIs : invoice?.invoiceFinanceObj?.financingScore}/>

      {openApprove && (<Approve loading={loading} state={state} setState={setState} handleFinanceAction={handleFinanceAction} handleClose={handleClose} inv={invoice}/>)}
      {openDisburse && (<Disburse loading={loading} state={state} setState={setState} handleFinanceAction={handleFinanceAction} handleClose={handleClose} inv={invoice}/>)}
      {openRepayment && (<Repayment loading={loading} state={state} setState={setState} handleFinanceAction={handleFinanceAction} handleClose={handleClose} inv={invoice}/>)}
      {openNeedMore && (<NeedMore loading={loading} state={state} setState={setState} handleFinanceAction={handleFinanceAction} handleClose={handleClose} inv={invoice}/>)}
      {openReject && (<Reject loading={loading} state={state} setState={setState} handleFinanceAction={handleFinanceAction} handleClose={handleClose} inv={invoice}/>)}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ padding: '12px 12px 10px 12px', spacing: 2 }}>
            <TabContext value={value}>
              <Box sx={{ borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label={t(`${lang.tabs}.request`)} value="1" onClick={() => {
            setShowTable(true);
        }}/>
                  <Tab label={t(`${lang.tabs}.logs`)} value="2" onClick={() => {
            setShowTable(false);
        }}/>
                  <Tab label={t(`${lang.tabs}.documents`)} value="3" onClick={() => {
            setShowTable(false);
        }}/>
                </TabList>
              </Box>
              {/* <Divider sx={{ py: '3px' }} /> */}
              <Box sx={{ width: 1, padding: 0, margin: 0 }}>
                {' '}
                {/* Set width to 1 for full width, and remove padding and margin */}
                <TabPanel value="1">
                  <RequestOverview invoiceData={invoice}/>
                </TabPanel>
                <TabPanel value="2">
                  <FinanceLogs invId={invoiceId}/>
                </TabPanel>
                <TabPanel value="3">
                  <DocumentList userId={invoice?.invoiceFinanceObj?.requesterId} invoiceId={invoiceId}/>
                </TabPanel>
              </Box>
            </TabContext>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {invoice?.invoiceFinanceObj?.bankForFinancing?.bankName !== 'CreditBook' && (<Paper elevation={3} sx={{
                pt: 5,
                pb: 5,
                px: 5,
                // mt: 9,
                width: 1,
                // minHeight: 200,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}>
              <Stack spacing={2}> {renderConditionalButtons()}</Stack>
            </Paper>)}
          <Paper elevation={3} sx={{
            pt: 5,
            px: 5,
            mt: 2,
            width: 1,
            //   height: 400,
            borderRadius: 2,
            // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            // border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}>
            <FinanceStatusTimeLine invoice={invoice}/>
          </Paper>
        </Grid>
        {/* </Card> */}
        {/* </Grid> */}
      </Grid>

      {showTable ? (<Grid container sx={{ marginTop: 3 }}>
          <Typography variant="h4">Credit Score (Time Of Request)</Typography>
          <Grid item xs={12} mt={2}>
            <Card sx={{ borderRadius: '0px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>SR</b>
                    </TableCell>
                    <TableCell>
                      <b>Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Description</b>
                    </TableCell>
                    <TableCell>
                      <b>Score</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (<TableRow key={row.id}>
                      <TableCell>
                        <b>{row.id}</b>
                      </TableCell>
                      <TableCell>
                        <b>{row.name}</b>
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>
                        {row.score === 0 ? (row.score) : (<b>{fNumber(invoice?.invoiceFinanceObj?.financingScore[row.score])}</b>)}
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        </Grid>) : ('')}
    </Container>);
}
