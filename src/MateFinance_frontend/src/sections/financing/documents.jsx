import { useCallback, useEffect, useState } from 'react';

// @redux
import { useDispatch, useSelector } from 'react-redux';
import { getUserFinance } from 'src/redux/slices/user';
// @mui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// @template
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify/iconify';
import { UploadBox } from 'src/components/upload';
//
import LoadingSpinner from 'src/components/loading-screen/loading-spinner';
import { useBoolean } from 'src/hooks/use-boolean';
import axiosInstance, { endpoints } from 'src/utils/axios';
import getBase64 from 'src/utils/getBase64';
import FinanceProfileDocumentTable from './table/Documents/finance-profile-document-table';
import FinanceRequestDocumentTable from './table/Documents/finance-request-document-table';

export default function DocumentList({ userId, invoiceId }) {
  const dispatch = useDispatch();

  const loading = useBoolean();

  const [fileDetail, setFileDetail] = useState({
    open: false,
    file: '',
    fileTitle: '',
    fileDiscription: '',
  });
  const {
    user: { documents },
  } = useSelector((state) => state);
  const [docs, setDocs] = useState([]);

  const {
    userFinance: { organizationType },
  } = useSelector((state) => state.user);

  useEffect(() => {
    loading.onTrue();

    dispatch(getUserFinance(userId))
      .then(() => {
        // When the API response comes, set loading to false
        loading.onFalse();
      })
      .catch((error) => {
        // Handle error if needed
        console.error('Error fetching user finance data:', error);
        enqueueSnackbar(error.toString(), { variant: 'error' });
        loading.onFalse();
      });
  }, [userId]);

  const handleDrop = useCallback((acceptedFiles) => {
    setFileDetail((prev) => ({ ...prev, open: true, file: acceptedFiles[0] }));
    console.log('🚀 ~ acceptedFiles:', acceptedFiles);
  }, []);

  const getDocList = async () => {
    try {
      const res = await axiosInstance.post(endpoints.admin.documentList, {
        organizationType: organizationType || 'SME',
      });
      console.log('🚀 ~ file: documents.jsx:80 ~ getDocList ~ res:', res);

      setDocs(res);
    } catch (error) {
      console.log('🚀 ~ getDocList ~ error:', error);
    }
  };
  // handle file name and description chnage
  const handleAttachmentNameChange = (event) => {
    const { name, value } = event.target;
    console.log(
      '🚀 ~ file: documents.jsx:90 ~ handleAttachmentNameChange ~  name, value:',
      name,
      value
    );
    setFileDetail((attachmentDetails) => ({
      ...attachmentDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    getDocList();
  }, []);

  //   *Upload Documents
  const handleUploadAttachment = async () => {
    const payload = {
      _id: userId,
      title: fileDetail?.fileTitle,
      description: fileDetail?.fileDiscription,
      docType: fileDetail?.docType,
      nonAdditional: false,
      invMongoId: fileDetail?.invMongoId,
      invoiceId,
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
      await axiosInstance.post(endpoints.admin.uploadDocuments, payload);
      setFileDetail((attachmentDetails) => ({
        open: false,
        file: '',
        fileTitle: '',
        fileDiscription: '',
      }));
      dispatch(getUserFinance(userId));
      enqueueSnackbar('Document Uploaded');
    } catch (error) {
      enqueueSnackbar(error.toString(), { variant: 'error' });
    }
  };

  return (
    <>
      {loading.value && <LoadingSpinner />}
      <Box
        fullWidth
        sx={{
          // width:'100%',
          // ml: '-36px',
          // mr: '-36px',
          mb: '-30px',
          // width: 1,
        }}
      >
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div sx={{ p: 4 }}>
          {/* <Typography variant="h4" color="primary">
            {t(`${lang.finReq}.documentAttachment`)}
          </Typography> */}
        </div>
        <FinanceRequestDocumentTable documents={documents} />
        <Divider sx={{ my: 3 }} />
        <FinanceProfileDocumentTable documents={documents} />
      </Box>
      <Box sx={{ mt: '60px', mb: '-35px' }}>
        <UploadBox
          accept={{
            'image/*': [],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xls', '.xlsx'],
          }}
          onDrop={handleDrop}
          placeholder={
            <Stack spacing={0.5} alignItems="center">
              <Iconify icon="eva:cloud-upload-fill" width={40} />
              <Typography variant="body2">Upload Attachments</Typography>
            </Stack>
          }
          sx={{ w: 1, flexGrow: 1, height: 'auto', py: 2.5, mb: 3 }}
        />
      </Box>
      {/* Dialoge box for Filename and description */}

      <Dialog
        open={fileDetail.open}
        maxWidth="xs"
        onClose={() =>
          setFileDetail((prev) => ({ file: '', fileTitle: '', fileDiscription: '', open: false }))
        }
      >
        <DialogTitle>File Detail</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 2 }}
            select
            size="small"
            fullWidth
            value={fileDetail.docType}
            label="Document Type"
            name="docType"
            onChange={(event) => handleAttachmentNameChange(event)}
          >
            {docs?.length > 0 &&
              docs?.map((doc) => (
                <MenuItem key={doc} value={doc?.docType}>
                  {doc?.docType} {doc?.required ? '*' : ''}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            autoFocus
            onChange={(event) => handleAttachmentNameChange(event)}
            value={fileDetail?.fileTitle}
            name="fileTitle"
            label="Attachment Title"
            placeholder=""
            size="small"
            className="customTextField"
          />

          <TextField
            sx={{ mt: 2 }}
            fullWidth
            onChange={(event) => handleAttachmentNameChange(event)}
            value={fileDetail?.fileDiscription}
            name="fileDiscription"
            label="Attachment Description"
            placeholder=""
            size="small"
            className="customTextField"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleUploadAttachment}>
            Upload
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={() =>
              setFileDetail((prev) => ({
                file: '',
                fileTitle: '',
                fileDiscription: '',
                open: false,
              }))
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
