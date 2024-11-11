/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import sum from 'lodash/sum';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
// @mui
import { Button, Container, IconButton, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { alpha, styled } from '@mui/material/styles';
// utils
import axiosInstance, { endpoints, getIP, jwtDecode } from 'src/utils/axios';
import { fCurrency, fNumber, fthousandNumber } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
// locales
import { useLocales } from 'src/locales';
// _mock
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
//
import QRCodeLib from 'react-qr-code';
// import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Iconify from 'src/components/iconify/iconify';
import ViewAttachments from 'src/components/view-attachment';
import { paths } from 'src/routes/paths';
// import InvoiceStatusTimeLine from 'src/sections/invoice/invoice-status-timeline';
// import InvoiceTagsInput from 'src/sections/invoice/invoice-tags';
// import FinanceStatusTimeLine from 'src/sections/purchases/finance-status-timeline';
import { checkInvoiceStatus, getPaymentTypeString, removeCommaAndRound, uuid, } from 'src/utils/format-number';
// import InvoiceStatusTimeLine from './invoice-status-timeline';
// import InvoiceTagsInput from './invoice-tags';
// import InvoiceToolbar from './invoice-toolbar';
// import { useRouter } from 'src/routes/hook';
// import { lang } from 'src/locales/multiLang';
// import InvoiceToolbar from 'src/sections/invoice/invoice-toolbar';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import { useRouter } from 'src/routes/hooks';
import axios from 'axios';
import { CRED_HOST_API, IM_HOST_API } from 'src/config-global';
// ----------------------------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& td': {
        borderBottom: 'none',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
}));
// ----------------------------------------------------------------------
const TABS = [
    {
        value: 'invoice',
        label: 'Invoice',
    },
    {
        value: 'finance',
        label: 'Finance',
    },
];
export default function AdminInvoiceDetails({ id }) {
    // multi language translator
    const { t } = useLocales();
    const multiLang = 'boilerplate.components.Invoices.invoiceStatus';
    const multiLang2 = 'boilerplate.components.Invoices';
    const multiLang3 = 'boilerplate.components.Invoices.newInvoiceLayoutMessages';
    // const multiLang4 = 'boilerplate.components.Sidebar';
    const [searchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    // tabs
    // const { userData } = useSelector((state) => state.auth);
    const [trackingType, setTrackingType] = useState('invoice');
    const handleChangeTab = useCallback((event, newValue) => {
        setTrackingType(newValue);
    }, []);
    //
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const router = useRouter();
    const [currentStatus, setCurrentStatus] = useState();
    const token = sessionStorage.getItem('accessToken');
    const user = jwtDecode(token);
    const [isLoading, setIsLoading] = useState(false);
    const [invoice, setInvoice] = useState({});
    const [viewFile, setViewFile] = useState({
        file: null,
        view: false,
    });
    const [tags, setTags] = useState([]);
    const [isVendor, setIsVendor] = useState(false);
    const [QRCode, setQRCode] = useState('');
    const [userIP, setUserIP] = useState('');
    const [totalOnRow, setTotalOnRow] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentObj, setPaymentObj] = useState({
        netAmt: '',
        invoiceId: '',
        ipAddress: '',
        paymentID: '',
        vendorMobileNumber: '',
        vendorEmail: '',
        vendorId: '',
        currencyCode: '',
        paidAmount: '',
        paymentType: '',
        receiptUrl: '',
        paymentGateway: '',
        notes: '',
        accountName: '',
        accountNumber: '',
        _id: '',
        paid: false,
    });
    // load initial data
    useEffect(() => {
        if (id) {
            getInvoice();
            // const link = `${SELF}${'sales'}/${id}?shareExt=${true}`;
            const link = ``;
            setQRCode(link);
            // getQRCode(id, 'sales').then((res) => {
            //   setQRCode(res);
            // });
            getIP().then((res) => {
                setUserIP(res);
            });
        }
    }, [id]);
    // CHeck the loggedIn user is vendor or not
    useEffect(() => {
        if (user) {
            if (user?.loginType === 'mobileNumber' &&
                invoice?.vendorMobileNumber === user?.mobileNumber) {
                setIsVendor(true);
            }
            else if (user?.loginType === 'email' && invoice?.vendorEmail === user?.email) {
                setIsVendor(true);
            }
            else {
                setIsVendor(false);
            }
        }
        else {
            setIsVendor(false);
        }
    }, [user, invoice]);
    // Sum total of all invoice lines
    useEffect(() => {
        if (invoice?.lines?.length > 0) {
            const rowTotals = invoice?.lines?.map((item) => {
                const rowTotal = Number(item.quantity) * removeCommaAndRound(item.unitPrice);
                const discountAmount = item.isDiscountPercent
                    ? (Number(item.discount) / 100) * rowTotal
                    : Number(item.discount);
                const discountedTotal = rowTotal - discountAmount;
                const taxAmount = item.isTaxPercentage
                    ? (Number(item.tax) / 100) * rowTotal
                    : Number(item.tax);
                const taxedTotal = discountedTotal + taxAmount;
                return taxedTotal;
            });
            setTotalOnRow(rowTotals);
            const subt = sum(invoice?.lines?.map((item) => item.quantity * removeCommaAndRound(item.unitPrice)));
            setSubTotal(subt);
            setDiscount(_getSumOfDiscount(invoice?.lines));
            setTax(_getSumOfTaxes(invoice?.lines));
            setTotalAmount(subt - _getSumOfDiscount(invoice?.lines) + _getSumOfTaxes(invoice?.lines));
        }
    }, [JSON.stringify(invoice?.lines)]);
    // get Invoice Details by id
    const getInvoice = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(CRED_HOST_API + endpoints.app.getExtInvoice + id);
            setInvoice(response?.data?.invoice);
            setTags(response?.data?.invoice?.invoiceTags);
            setPaymentObj({
                ipAddress: userIP,
                invoiceId: response?.data?.invoice?.invoiceId,
                paymentID: uuid(),
                vendorMobileNumber: response?.data?.invoice?.vendorMobileNumber
                    ? response?.data?.invoice?.vendorMobileNumber
                    : '',
                vendorEmail: response?.data?.invoice?.vendorEmail
                    ? response?.data?.invoice?.vendorEmail
                    : '',
                vendorId: response?.data?.invoice?.vendorId,
                currencyCode: response?.data?.invoice?.currency.code,
                paidAmount: response?.data?.invoice?.netAmt,
                paymentType: response?.data?.invoice?.fundReception.type,
                receiptUrl: '',
                paymentGateway: response?.data?.invoice?.fundReception.type,
                notes: response?.data?.invoice?.description,
                accountName: response?.data?.invoice?.fundReception.accountName
                    ? response?.data?.invoice?.fundReception.accountName
                    : response?.data?.invoice?.fundReception.accountTitle,
                accountNumber: response?.data?.invoice?.fundReception.accountNumber,
                _id: response?.data?.invoice?._id,
                paid: response?.data?.invoice?.paid,
                netAmt: response?.data?.invoice?.netAmt,
            });
            setIsLoading(false);
        }
        catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
            // handle the error
            enqueueSnackbar(error.toSring(), { variant: 'error' });
        }
    };
    // get sum of line items discount
    const _getSumOfDiscount = (items) => {
        return items?.reduce((accumulator, object) => {
            const rowTotal = Number(object.quantity) * removeCommaAndRound(object.unitPrice);
            const discount = object.isDiscountPercent && Number(object.discount) !== 0
                ? (Number(object.discount) / 100) * rowTotal
                : Number(object.discount);
            return accumulator + discount;
        }, 0);
    };
    // get sum of line items tax
    const _getSumOfTaxes = (items) => {
        return items?.reduce((accumulator, object) => {
            const rowTotal = Number(object.quantity) * removeCommaAndRound(object.unitPrice);
            const discountAmount = object.isDiscountPercent
                ? (Number(object.discount) / 100) * rowTotal
                : Number(object.discount);
            const discountedTotal = rowTotal - discountAmount;
            const taxAmount = object.isTaxPercentage
                ? (Number(object.tax) / 100) * rowTotal
                : Number(object.tax);
            return accumulator + taxAmount;
        }, 0);
    };
    // view attachment
    const viewAttachment = (file) => {
        setViewFile((viewFile) => ({
            ...viewFile,
            view: true,
            file,
        }));
    };
    // close view modal attachment
    const closeAttViewModal = () => {
        setViewFile((viewFile) => ({
            ...viewFile,
            view: false,
            file: null,
        }));
    };
    const handleChangeStatus = useCallback((event) => {
        setCurrentStatus(event.target.value);
    }, []);
    const renderTotal = (<Stack sx={{ w: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Stack spacing={2} sx={{ mt: 3, typography: 'body2', flexDirection: 'row' }}>
        {invoice?.attachments?.map((file, index) => (<Box sx={{
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
            }}>
            <Iconify icon="iconamoon:attachment-duotone" width={28}/>
            <Typography>{file?.attachmentTitle?.substring(0, 10)}</Typography>
            <Box sx={{ justifyContent: 'space-between' }}>
              <IconButton onClick={() => viewAttachment(file)}>
                <Iconify icon="carbon:view-filled" width={18}/>
              </IconButton>
            </Box>
          </Box>))}
      </Stack>

      <Stack spacing={2} sx={{ mt: 3, mr: 3, typography: 'body2', width: 200 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box sx={{ color: 'text.secondary' }}>{`Subtotal (${invoice?.currency?.code})`}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{fNumber(subTotal) || '-'}</Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Box sx={{ color: 'text.secondary' }}>Discount</Box>
          <Box sx={{ color: 'error.main' }}>{discount ? `- ${fNumber(discount)}` : '-'}</Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Box sx={{ color: 'text.secondary' }}>Tax/Vat</Box>
          <Box>{tax ? fNumber(tax) : '-'}</Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ typography: 'subtitle1' }}>
          <Box>{`Total (${invoice?.currency?.code})`}</Box>
          <Box>{fNumber(totalAmount) || '-'}</Box>
        </Stack>
      </Stack>
    </Stack>);
    const renderList = (<>
      <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
        <Scrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: '4px' }} sx={{ typography: 'subtitle2' }}>
                  Item
                </TableCell>
                <TableCell style={{ padding: '4px' }}>Qty</TableCell>
                <TableCell style={{ padding: '4px' }}>Unit price</TableCell>
                <TableCell style={{ padding: '4px' }}>Discount</TableCell>
                <TableCell style={{ padding: '4px' }}>Tax/Vat</TableCell>
                <TableCell style={{ padding: '4px' }}>Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {invoice?.lines?.map((row, index) => (<TableRow key={index}>
                  <TableCell style={{ padding: '4px' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {row?.item}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell style={{ padding: '4px' }}>
                    {`${row?.quantity} ${row?.quantityUnit}`}
                  </TableCell>
                  <TableCell style={{ padding: '4px' }}>{fNumber(row?.unitPrice)}</TableCell>
                  <TableCell style={{ padding: '4px' }}>
                    {row?.discount + (row?.isDiscountPercent ? '%' : '')}
                  </TableCell>
                  <TableCell style={{ padding: '4px' }}>
                    {row?.tax + (row?.isTaxPercentage ? '%' : '')}
                  </TableCell>
                  <TableCell style={{ padding: '4px' }}>{fNumber(totalOnRow[index])}</TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      {renderTotal}
    </>);
    const { finance, invoiceFinanceObj } = invoice;
    const filtertab = TABS.filter((tab) => {
        // if (tab.value === 'finance') {
        //   return finance === true || userData?.userId === invoiceFinanceObj?.requesterId;
        // }
        return tab.value === 'invoice';
    });
    return (<>
      {isLoading && <LoadingScreenCustom />}
      <Container maxWidth="xxl">
        {/* {tab === 'history' && ( */}
        {/* <CustomBreadcrumbs
          heading={invoice?.invoiceId}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: `Invoice`,
              href: -1,
            },
            {
              name: `InvoiceView`,
              href: paths.dashboard,
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          action={
            <Button variant="contained" color="primary" onClick={() => router.push(-1)}>
              <Iconify icon="ep:back" sx={{ alignItems: 'left', marginLeft: '-6px' }} /> Back
            </Button>
          }
        /> */}
        {/* )} */}
        {/* <InvoiceToolbar
          invoice={invoice}
          paymentObj={paymentObj}
          shareLink={QRCode}
          userIP={userIP}
          isVendor={isVendor}
          currentStatus={currentStatus || ''}
          onChangeStatus={handleChangeStatus}
          getInvoice={getInvoice}
        /> */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ pt: 5, px: 5, pb: 5 }}>
              <Box gap={4} display="flex" alignItems="center">
                <QRCodeLib value={`Invoice Number: ${invoice?.invoiceId} 
                    \nInvoice To: ${invoice?.clientFirstName} ${invoice?.clientLastName}
                    \nInvoice From : ${invoice?.vendorName} 
                    \nTotal: ${fthousandNumber(invoice.netAmt)}
                    \nInvoice URL: ${QRCode} \n`} size={120} fgColor="#5a2c66" title="Vendor Details" bgColor="#fff"/>
                <Stack spacing={1}>
                  <Typography variant="h6">Invoice # {invoice?.invoiceId}</Typography>
                  {tab !== 'history' && (<Typography variant="h6">Ref # {invoice?.invoiceRef}</Typography>)}
                  <Label sx={{ borderRadius: '20px' }} variant="soft" color={tab !== 'history'
            ? (checkInvoiceStatus(invoice) === `Overdue` && 'warning') ||
                (checkInvoiceStatus(invoice) === 'Awaiting Payment' && 'warning') ||
                (checkInvoiceStatus(invoice) === 'Paid' && 'success') ||
                (checkInvoiceStatus(invoice) === 'Rejected' && 'error') ||
                (checkInvoiceStatus(invoice) === 'Voided' && 'error') ||
                (checkInvoiceStatus(invoice) === 'Draft' && 'info') ||
                'default'
            : invoice?.invStatus === 'paid'
                ? 'success'
                : 'warning'}>
                    {tab !== 'history' ? checkInvoiceStatus(invoice) : invoice?.invStatus}
                  </Label>
                </Stack>
              </Box>
              <br />
              <Box gap={4} display="grid" alignItems="center" gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(6, 1fr)',
        }}>
                <Stack sx={{ typography: 'body2' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {`Invoice Form`}
                  </Typography>
                  {invoice?.vendorName}
                  <br />
                  {invoice?.vendorEmail}
                  <br />
                  Phone: {invoice?.vendorMobileNumber}
                  <br />
                </Stack>

                <Stack sx={{ typography: 'body2' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {`Invoice To`}
                  </Typography>
                  {`${invoice?.clientFirstName} ${invoice?.clientLastName}`}
                  <br />
                  {invoice?.clientEmail}
                  <br />
                  Phone: {invoice?.clientMobileNumber}
                  <br />
                </Stack>

                <Stack sx={{ typography: 'body2' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Invoice Date
                    {/* {t(`${multiLang3}.DateCreate`)} */}
                  </Typography>
                  {fDate(invoice?.creationDate)}
                </Stack>

                <Stack sx={{ typography: 'body2' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {`Due Date`}
                  </Typography>
                  {fDate(invoice?.dueDate)}
                </Stack>

                <Stack sx={{ typography: 'body2' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {`Invoice Currency`}
                  </Typography>
                  {invoice?.currency?.code}
                </Stack>

                <Stack sx={{ typography: 'body2' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {`Payment Instrument`}
                  </Typography>
                  {getPaymentTypeString(invoice?.fundReception?.type)}
                </Stack>
                {getPaymentTypeString(invoice?.fundReception?.type) !== 'Cash' && (<>
                    <Stack sx={{ typography: 'body2' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Account Number
                      </Typography>
                      {getPaymentTypeString(invoice?.fundReception?.accountNumber)}
                    </Stack>

                    {getPaymentTypeString(invoice?.fundReception?.type) === 'Bank Transfer' && (<Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Bank Name
                        </Typography>
                        {invoice?.fundReception?.bankName}
                      </Stack>)}

                    <Stack sx={{ typography: 'body2' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Account Title
                      </Typography>
                      {invoice?.fundReception?.accountTitle
                ? invoice?.fundReception?.accountTitle
                : invoice?.fundReception?.accountName}
                    </Stack>

                    {getPaymentTypeString(invoice?.fundReception?.type) === 'Bank Transfer' && (<Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          IBAN
                        </Typography>
                        {invoice?.fundReception?.iBAN}
                      </Stack>)}
                    {getPaymentTypeString(invoice?.fundReception?.type) === 'Bank Transfer' && (<Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Branch Code
                        </Typography>
                        {invoice?.fundReception?.branchCode}
                      </Stack>)}
                    {getPaymentTypeString(invoice?.fundReception?.type) === 'Bank Transfer' && (<Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Address
                        </Typography>
                        {invoice?.fundReception?.bankAddress}
                      </Stack>)}
                  </>)}
              </Box>

              <Stack sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {`Invoice Description`}
                </Typography>
                {invoice?.description}
              </Stack>
              {renderList}
            </Card>
            {/* <InvoiceTagsInput tags={tags?.map((tag) => tag?.tagName)} setTags={setTags} view /> */}
          </Grid>

          {/* STEPPER */}
          {/* {token && tab !== 'history' && !invoice?.createdWithoutLogin && (
          <Grid item xs={12} md={3}>
            <Card sx={{ pt: 0.5, px: 0.5 }}>
              <Tabs value={trackingType} onChange={handleChangeTab} sx={{ px: 1 }}>
                {filtertab.map((tab) => (
                  <Tab
                    key={tab.value}
                    iconPosition="end"
                    value={tab.value}
                    label={tab.label}
                    sx={{
                      '&:not(:last-of-type)': {
                        mr: 3,
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Card>
          </Grid>
        )} */}
        </Grid>

        {/* ATTACHMENT VIEW */}
        <ViewAttachments open={viewFile.view} setOpen={closeAttViewModal} attachment={viewFile.file}/>
      </Container>
    </>);
}
AdminInvoiceDetails.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    invoice: PropTypes.object,
};
