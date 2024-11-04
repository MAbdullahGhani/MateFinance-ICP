// import { Button } from '@mui/base';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Iconify from 'src/components/iconify/iconify';
import { UploadBox } from 'src/components/upload';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';

export default function UploadCNIC({ setUserInfo, userInfo, completed, userFinance }) {
  const [checkCnic, setCheckCnic] = useState();
  const [cnic, setCnic] = useState();
  const {
    auth: { userAttachments },
  } = useSelector((state) => state);

  const { t } = useLocales();
  const handleDropFront = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setCheckCnic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setCnic('cnicFrontImage');
        setUserInfo((prev) => ({ ...prev, cnicFrontImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDropBack = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setCheckCnic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setCnic('cnicBackImage');
        setUserInfo((prev) => ({ ...prev, cnicBackImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const getDataFormOCR = async () => {
    const formData = new FormData();
    formData.append('file', checkCnic);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    await axios({
      method: 'post',
      url: `https://app.invoicemate.net/ocr-cnic/uploadfile`,
      data: formData,
      config,
    })
      .then((result) => {
        const cincInfo = result.data;
        if (cnic === 'cnicFrontImage') {
          if (result.data.Type === 'CNIC-Front') {
            setUserInfo((formState) => ({
              ...formState,
              fullName: cincInfo.name,
              DateOfBirth: cincInfo.date_of_birth,
              // expiry_date: cincInfo.expiry_date,
              fatherName: cincInfo.father_name,
              cnicNumber: cincInfo.cnic_no,
              frontRecognition: true,
            }));
          } else if (result.data.Type === 'OLD CNIC-Front') {
            setUserInfo((formState) => ({
              ...formState,
              frontRecognition: true,
            }));
            console.log('im cnic front old');
          } else {
            // disable button if user upload incorrect cnic
            setUserInfo((formState) => ({
              ...formState,
              frontRecognition: false,
            }));
            completed.onFalse();
            enqueueSnackbar('Invalid Front CNIC', { variant: 'error' });
          }
        } else if (result.data.Type === 'CNIC-Back') {
          setUserInfo((formState) => ({
            ...formState,
            backRecognition: true,
          }));
        } else if (result.data.Type === 'OLD CNIC-Back') {
          setUserInfo((formState) => ({
            ...formState,
            backRecognition: true,
          }));
        } else {
          // disable button if user upload incorrect cnic
          setUserInfo((formState) => ({
            ...formState,
            backRecognition: false,
          }));
          completed.onFalse();
          enqueueSnackbar('Invalid Back CNIC', { variant: 'error' });
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' });
      });
  };
  useEffect(() => {
    if (checkCnic) {
      getDataFormOCR();
    }
  }, [userInfo.cnicFrontImage, userInfo.cnicBackImage]);

  //
  useEffect(() => {
    debugger;
    if (userInfo.frontRecognition && userInfo.backRecognition) {
      completed.onTrue();
    }
  }, [userInfo.frontRecognition, userInfo.backRecognition]);

  // set Users CNIC If exist
  useEffect(() => {
    if (userInfo.cnicFrontImage === '' || userInfo.cnicBackImage === '') {
      if (userFinance?.cnicFrontImage || userFinance?.cnicBackImage) {
        setUserInfo((prev) => ({
          ...prev,
          cnicFrontImage: userFinance?.cnicFrontImage,
          cnicBackImage: userFinance?.cnicBackImage,
        }));
      }
    }
  }, [userFinance]);

  function checkType(string) {
    // Check if the string is a base64 encoded file.
    const contentType = string?.includes('base64');

    // Check if the string is a URL.
    if (isURL(string)) {
      return 'URL';
    }
    if (contentType) {
      return 'base64';
    }

    return 'empty';
  }

  function isURL(string) {
    // A URL must start with either "http://" or "https://".

    return string.includes('uploads');
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <UploadBox
            accept={{ 'image/jpeg': [], 'image/png': [] }}
            file={
              checkType(userInfo.cnicFrontImage) === 'base64' ||
              checkType(userInfo.cnicFrontImage) === 'empty'
                ? userInfo.cnicFrontImage
                : `${userAttachments.url}${userInfo.cnicFrontImage}${userAttachments.token}`
            }
            onDrop={handleDropFront}
            sx={{
              mb: 3,
              py: 2.5,
              //   width: '640px',
              height: '300px',
              borderRadius: 1.5,
            }}
            placeholder={
              <Stack spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                <Iconify icon="eva:cloud-upload-fill" width={40} />
                <Typography variant="body2">
                  {t(`${lang.financing}.uploadCNICFrontPicture`)}
                </Typography>
              </Stack>
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UploadBox
            accept={{ 'image/jpeg': [], 'image/png': [] }}
            file={
              checkType(userInfo.cnicBackImage) === 'base64' ||
              checkType(userInfo.cnicBackImage) === 'empty'
                ? userInfo.cnicBackImage
                : `${userAttachments.url}${userInfo.cnicBackImage}${userAttachments.token}`
            }
            onDrop={handleDropBack}
            sx={{
              mb: 3,
              py: 2.5,
              height: '300px',
              borderRadius: 1.5,
            }}
            placeholder={
              <Stack spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                <Iconify icon="eva:cloud-upload-fill" width={40} />
                <Typography variant="body2">
                  {t(`${lang.financing}.uploadCNICBackPicture`)}
                </Typography>
              </Stack>
            }
          />
        </Grid>
      </Grid>
    </div>
  );
}
