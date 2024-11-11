import { useCallback, useEffect, useState } from 'react';
import axios, { endpoints } from 'src/utils/axios';
// @redux
import { useDispatch, useSelector } from 'react-redux';
import { getUserFinance } from 'src/redux/slices/user';
// @mui
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography, } from '@mui/material';
// @template
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify/iconify';
import LoadingSpinner from 'src/components/loading-screen/loading-spinner';
import { useSettingsContext } from 'src/components/settings';
import { UploadBox } from 'src/components/upload';
import { lang } from 'src/locales/multiLang';
import { paths } from 'src/routes/paths';
import getBase64 from 'src/utils/getBase64';
import DocumentsTable from './table/Documents/document-table';
export default function InvoiceList({ invId }) {
    const dispatch = useDispatch();
    const settings = useSettingsContext();
    const [loading, setLoading] = useState(false);
    const [fileDetail, setFileDetail] = useState({
        open: false,
        file: '',
        fileTitle: '',
        fileDiscription: '',
    });
    const { auth: { userData: { userId }, }, user: { historyInvoices }, } = useSelector((state) => state);
    useEffect(() => {
        // Set loading to true when the effect runs
        setLoading(true);
        dispatch(getUserFinance(userId))
            .then(() => {
            // When the API response comes, set loading to false
            setLoading(false);
        })
            .catch((error) => {
            // Handle error if needed
            console.error('Error fetching user finance data:', error);
            enqueueSnackbar(error.toString(), { variant: 'error' });
            setLoading(false);
        });
    }, [dispatch, userId]);
    const handleDrop = useCallback((acceptedFiles) => {
        if (!acceptedFiles[0]) {
            enqueueSnackbar('Invalid File', { variant: 'error' });
        }
        else {
            setFileDetail((prev) => ({ ...prev, open: true, file: acceptedFiles[0] }));
        }
    }, []);
    // handle file name and description chnage
    const handleAttachmentNameChange = (event) => {
        event.persist();
        const { name, value } = event.target;
        setFileDetail((attachmentDetails) => ({
            ...attachmentDetails,
            [name]: value,
        }));
    };
    //   *Upload Documents
    const handleUploadAttachment = async () => {
        const payload = {
            _id: userId,
            title: fileDetail?.fileTitle,
            description: fileDetail?.fileDiscription,
            attachments: [
                {
                    name: fileDetail?.file?.name,
                    base64: await getBase64(fileDetail.file),
                    type: fileDetail?.file?.type,
                    attachmentPath: '',
                },
            ],
        };
        try {
            await axios.post(endpoints.setting.uploadInvoice, payload);
            setFileDetail((attachmentDetails) => ({
                open: false,
                file: '',
                fileTitle: '',
                fileDiscription: '',
            }));
            dispatch(getUserFinance(userId));
            enqueueSnackbar('Invoice Uploaded');
        }
        catch (error) {
            enqueueSnackbar(error.toString(), { variant: 'error' });
        }
    };
    return (<Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs heading={'Upload Invoices'} subHeading={t(`${lang.subheader}.uploadInvoices`)} links={[
            {
                name: t('boilerplate.components.Sidebar.Dashboard'),
                href: paths.dashboard.root,
            },
            {
                name: 'Upload Invoices',
                href: paths.dashboard.setting,
            },
        ]} sx={{
            mb: { xs: 3, md: 5 },
        }}/>
      {loading && <LoadingSpinner />}
      <Box sx={{
            width: 1,
        }}>
        <DocumentsTable documents={historyInvoices}/>
        <Divider sx={{ my: 1 }}/>

        {/* Upload Attachments */}
        <UploadBox onDrop={handleDrop} accept={{
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xls', '.xlsx'],
        }} placeholder={<Stack spacing={0.5} alignItems="center">
              <Iconify icon="eva:cloud-upload-fill" width={40}/>
              <Typography variant="body2">Upload Attachments</Typography>
            </Stack>} sx={{ w: 1, flexGrow: 1, height: 'auto', py: 2.5, mb: 3 }}/>
      </Box>

      {/* Dialoge box for Filename and description */}

      <Dialog open={fileDetail.open} maxWidth="xs" onClose={() => setFileDetail((prev) => ({ ...prev, open: false }))}>
        <DialogTitle>File Detail</DialogTitle>
        <DialogContent>
          <TextField sx={{ mt: 2 }} fullWidth autoFocus onChange={(event) => handleAttachmentNameChange(event)} value={fileDetail.fileTitle} name="fileTitle" label="Attachment Title" placeholder="" size="small" className="customTextField"/>

          <TextField sx={{ mt: 2 }} fullWidth onChange={(event) => handleAttachmentNameChange(event)} value={fileDetail.fileDiscription} name="fileDiscription" label="Attachment Description" placeholder="" size="small" className="customTextField"/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleUploadAttachment}>
            Upload
          </Button>
          <Button variant="contained" color="inherit" onClick={() => setFileDetail((prev) => ({ ...prev, open: false }))}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>);
}
