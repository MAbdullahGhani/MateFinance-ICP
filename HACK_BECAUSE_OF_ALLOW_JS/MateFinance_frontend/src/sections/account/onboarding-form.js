import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
// routes
// assets
import { PasswordIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
// utils
import axios, { endpoints } from 'src/utils/axios';
import { noWhiteSpaces } from 'src/utils/yup-validate';
import { fData } from 'src/utils/format-number';
// third party
import { IconButton } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { useAccount } from 'wagmi';
import { useWalletInfo } from '@web3modal/wagmi/react';
import axiosInstance from 'src/utils/axios';
import { ATTACHMENT_TOKEN, ATTACHMENT_URL } from 'src/config-global';
import { saveAs } from 'file-saver';
// ----------------------------------------------------------------------
const StepOneUserInfoForm = ({ profile }) => {
    // hook
    const { enqueueSnackbar } = useSnackbar();
    const { user, logout } = useAuthContext();
    const { address, isConnecting, isDisconnected } = useAccount();
    const { walletInfo } = useWalletInfo();
    // state
    // yup validation
    const UpdateUserSchema = Yup.object().shape({
        identityDoc: Yup.mixed().required('Required'),
        metamaskWallet: Yup.string(),
        additionalDocument: Yup.mixed(),
        email: Yup.string(),
    });
    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues: {
            identityDoc: '',
            metamaskWallet: '',
            additionalDocument: '',
            email: '',
        },
    });
    const { control, reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors }, } = methods;
    const { identityDoc, metamaskWallet, additionalDocument } = watch();
    useEffect(() => {
        getLenderDetails();
    }, []);
    const getLenderDetails = async () => {
        try {
            const response = await axiosInstance.get(`${endpoints.app.getLenderById}?id=${user?.id}`);
            let lender = response?.lender[0];
            if (profile) {
                setValue('email', lender?.email);
            }
            if (lender?.identityDoc?.length > 0) {
                setValue('identityDoc', {
                    name: lender?.identityDoc[0]?.attachmentTitle,
                    type: lender?.identityDoc[0]?.type,
                    dataURL: ATTACHMENT_URL + lender?.identityDoc[0]?.attachmentURL + ATTACHMENT_TOKEN,
                    url: lender?.identityDoc[0]?.attachmentURL,
                });
            }
            if (lender?.additionalDocument?.length > 0) {
                setValue('additionalDocument', {
                    name: lender?.additionalDocument[0]?.attachmentTitle,
                    type: lender?.additionalDocument[0]?.type,
                    dataURL: ATTACHMENT_URL + lender?.additionalDocument[0]?.attachmentURL + ATTACHMENT_TOKEN,
                    url: lender?.additionalDocument[0]?.attachmentURL,
                });
            }
        }
        catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
        }
    };
    const onSubmit = useCallback(async (data) => {
        if (!profile && !address) {
            enqueueSnackbar('Please Connect Your Wallet', { variant: 'info' });
            return;
        }
        const obj = {
            walletName: walletInfo?.name || '',
            walletIcon: walletInfo?.icon || '',
            walletAddress: address,
            email: data?.email,
            additionalDocument: data?.additionalDocument
                ? [
                    {
                        attachmentTitle: data?.additionalDocument?.name,
                        type: data?.additionalDocument?.type,
                        name: data?.additionalDocument?.name,
                        base64: data?.additionalDocument?.dataURL,
                    },
                ]
                : [],
            identityDoc: [
                {
                    attachmentTitle: data?.identityDoc?.name,
                    type: data?.identityDoc?.type,
                    name: data?.identityDoc?.name,
                    base64: data?.identityDoc?.dataURL,
                },
            ],
        };
        try {
            const response = await axios.post(!profile ? endpoints.app.onBoarding : endpoints.app.updateLenderAttInfo, obj);
            enqueueSnackbar(!profile
                ? 'Details Submit Successfully. Please login to use the system!'
                : response?.message);
        }
        catch (error) {
            enqueueSnackbar(error, {
                variant: 'error',
            });
        }
    }, [reset]);
    const handleDrop = useCallback((acceptedFiles, name) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            const dataURL = reader.result; // The base64 encoded image
            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
                dataURL, // Add the base64 encoded image to the newFile object
            });
            if (file) {
                setValue(name, newFile, { shouldValidate: true });
            }
        };
        reader.readAsDataURL(file);
    }, [setValue]);
    const viewAttachment = (attachment) => {
        const data = ATTACHMENT_URL + attachment + ATTACHMENT_TOKEN;
        window.open(data);
        // saveAs(data);
        // const link = document.createElement('a');
        // link.href = data;
        // link.setAttribute('download', '');
        // link.click();
    };
    const handleRemoveFile = useCallback((name) => {
        setValue(name, '', { shouldValidate: false });
    }, [setValue]);
    return (<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.0}>
        <Stack direction="column" spacing={2} width="-webkit-fill-available">
          {/* <w3m-button /> */}
          {/* <RHFTextField
          name="metamaskWallet"
          label="Meta Mask Wallet"
          size="small"
          InputLabelProps={{ shrink: true }}
        /> */}
          <Stack direction="column" alignItems="flex-start">
            <Typography variant="subtitle2">National ID/Passport/Driver's License</Typography>
            {identityDoc === '' && (<RHFUploadBox name="identityDoc" maxSize={3145728} onDrop={(file) => handleDrop(file, 'identityDoc')} onDelete={() => handleRemoveFile('identityDoc')}/>)}
            {identityDoc?.dataURL && (<Box sx={{
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
                <Typography>{identityDoc?.name?.substring(0, 10)}</Typography>
                <Typography variant="caption">{identityDoc?.type}</Typography>
                <Box sx={{ justifyContent: 'space-between' }}>
                  <IconButton>
                    <Iconify icon="material-symbols:download" onClick={() => viewAttachment(identityDoc?.url)} width={18}/>
                  </IconButton>
                  <IconButton>
                    <Iconify sx={{ color: 'error.main' }} icon="solar:trash-bin-trash-bold" onClick={() => handleRemoveFile('identityDoc')} width={18}/>
                  </IconButton>
                </Box>
              </Box>)}
          </Stack>
          <Stack direction="column" alignItems="flex-start">
            <Typography variant="subtitle2">Additional Document</Typography>
            {additionalDocument === '' && (<RHFUploadBox name="additionalDocument" maxSize={3145728} onDrop={(file) => handleDrop(file, 'additionalDocument')} onDelete={() => handleRemoveFile('additionalDocument')}/>)}
            {additionalDocument?.dataURL && (<Box sx={{
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
                <Typography>{additionalDocument?.name?.substring(0, 10)}</Typography>
                <Typography variant="caption">{additionalDocument?.type}</Typography>
                <Box sx={{ justifyContent: 'space-between' }}>
                  <IconButton>
                    <Iconify icon="material-symbols:download" onClick={() => viewAttachment(additionalDocument?.url)} width={18}/>
                  </IconButton>
                  <IconButton>
                    <Iconify sx={{ color: 'error.main' }} icon="solar:trash-bin-trash-bold" onClick={() => handleRemoveFile('additionalDocument')} width={18}/>
                  </IconButton>
                </Box>
              </Box>)}
          </Stack>
          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton color="primary" size="medium" type="submit" variant="contained" loading={isSubmitting} startIcon={<Iconify icon="material-symbols:save-outline"/>}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
    </FormProvider>);
};
export default StepOneUserInfoForm;
