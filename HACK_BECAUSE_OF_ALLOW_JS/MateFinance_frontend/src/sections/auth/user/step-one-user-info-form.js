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
import ValidPhoneInput from '../../../components/phone-number-input';
import { IconButton } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { useAccount } from 'wagmi';
import { useWalletInfo } from '@web3modal/wagmi/react';
import { ethers } from 'ethers';
// ----------------------------------------------------------------------
const StepOneUserInfoForm = (props) => {
    // props
    const { userInfoData, getUserInfo, router } = props;
    // hook
    const { enqueueSnackbar } = useSnackbar();
    const { user, logout } = useAuthContext();
    const { address, isConnecting, isDisconnected } = useAccount();
    const { walletInfo } = useWalletInfo();
    // state
    const [walletDetail, setWalletDetail] = useState(null);
    // yup validation
    const UpdateUserSchema = Yup.object().shape({
        photoURL: Yup.mixed(),
        identityDoc: Yup.mixed().required('Required'),
        metamaskWallet: Yup.string(),
        additionalDocument: Yup.mixed(),
    });
    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues: {
            photoURL: userInfoData.profileImg || '',
            identityDoc: '',
            metamaskWallet: '',
            additionalDocument: '',
        },
    });
    const { control, getValues, reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors }, } = methods;
    const { photoURL, identityDoc, metamaskWallet, additionalDocument } = watch();
    useEffect(() => {
        reset({
            photoURL: '',
            identityDoc: '',
            metamaskWallet: '',
            additionalDocument: '',
        });
    }, []);
    useEffect(() => {
        if ((address, walletInfo)) {
            setWalletDetail({ address, ...walletInfo });
        }
    }, [address, walletInfo]);
    const getAddress = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            return accounts[0];
        }
        else {
            return null;
        }
    };
    const onSubmit = async (data) => {
        debugger;
        if (!walletDetail) {
            enqueueSnackbar('Please Connect Your Wallet', { variant: 'info' });
            return;
        }
        const obj = {
            walletName: walletDetail?.name || '',
            walletIcon: walletDetail?.icon || '',
            walletAddress: walletDetail?.address,
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
            profilePicture: data?.photoURL
                ? [
                    {
                        attachmentTitle: data?.photoURL?.name,
                        type: data?.photoURL?.type,
                        name: data?.photoURL?.name,
                        base64: data?.photoURL?.dataURL,
                    },
                ]
                : [],
        };
        try {
            const response = await axios.post(endpoints.app.onBoarding, obj);
            await logout();
            enqueueSnackbar('Details Submit Successfully. Please login to use the system!');
            router.replace(paths.auth.jwt.login);
        }
        catch (error) {
            enqueueSnackbar(error, {
                variant: 'error',
            });
        }
    };
    const viewAttachment = (attachment) => {
        if (attachment === 'additionalDocument') {
            let att = getValues('additionalDocument');
            const link = document.createElement('a');
            link.href = att?.dataURL;
            link.setAttribute('download', '');
            link.click();
        }
        else {
            let att = getValues('identityDoc');
            const link = document.createElement('a');
            link.href = att?.dataURL;
            link.setAttribute('download', '');
            link.click();
        }
    };
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
    const handleRemoveFile = useCallback((name) => {
        setValue(name, '', { shouldValidate: false });
    }, [setValue]);
    // form reset from api result
    useEffect(() => {
        // Update default values when userInfoData changes
        if (userInfoData) {
            methods.reset({
                firstName: userInfoData.firstName || '',
                lastName: userInfoData.lastName || '',
                email: userInfoData.email || '',
                phoneNumber: userInfoData?.mobileNumber || '',
                photoURL: userInfoData.profileImg || '',
            });
        }
    }, [userInfoData, methods.reset]);
    // for every time i want updated data for certain changes
    useEffect(() => {
        getUserInfo();
    }, []);
    return (<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {console.log(identityDoc, additionalDocument)}
      <Stack flexDirection="row" justifyContent="flex-end">
        <w3m-button size="sm"/>
      </Stack>
      <Stack direction={'column'} spacing={2.0} width={1}>
        <Stack direction="row" width={1} gap={4} mt={2} sx={{
            border: '1px solid #EAECF0',
            borderRadius: '8px',
            padding: '5px 15px',
            mt: 3,
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            alignSelf: 'stretch',
        }}>
          <Box sx={{ mb: 2, width: { md: 250 } }}>
            <RHFUploadAvatar name="photoURL" maxSize={3145728} onDrop={(file) => handleDrop(file, 'photoURL')} helperText={<Typography variant="caption" sx={{
                mt: 3,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.disabled',
            }}>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>}/>
          </Box>
        </Stack>
        <Stack direction="row" width={1} gap={4} sx={{
            border: '1px solid #EAECF0',
            borderRadius: '8px',
            padding: '16px 24px',
        }}>
          {/* <RHFTextField
          name="metamaskWallet"
          label="Meta Mask Wallet"
          size="small"
          InputLabelProps={{ shrink: true }}
        /> */}
          <Stack direction="column">
            {!identityDoc && (<RHFUploadBox name="identityDoc" maxSize={3145728} onDrop={(file) => handleDrop(file, 'identityDoc')} onDelete={() => handleRemoveFile('identityDoc')}/>)}
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
                  <IconButton size="small" onClick={() => viewAttachment('identityDoc')}>
                    <Iconify icon="solar:eye-bold-duotone" width={18}/>
                  </IconButton>
                  <IconButton>
                    <Iconify sx={{ color: 'error.main' }} icon="solar:trash-bin-trash-bold" onClick={() => handleRemoveFile('identityDoc')} width={18}/>
                  </IconButton>
                </Box>
              </Box>)}
            <Typography variant="subtitle2">National ID/Passport/Driver's License</Typography>
          </Stack>
          <Stack direction="column" alignItems="flex-start">
            {!additionalDocument && (<RHFUploadBox name="additionalDocument" maxSize={3145728} onDrop={(file) => handleDrop(file, 'additionalDocument')} onDelete={() => handleRemoveFile('additionalDocument')}/>)}
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
                  <IconButton size="small" onClick={() => viewAttachment('additionalDocument')}>
                    <Iconify icon="solar:eye-bold-duotone" width={18}/>
                  </IconButton>
                  <IconButton>
                    <Iconify sx={{ color: 'error.main' }} icon="solar:trash-bin-trash-bold" onClick={() => handleRemoveFile('additionalDocument')} width={18}/>
                  </IconButton>
                </Box>
              </Box>)}
            <Typography variant="subtitle2">Additional Document</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent={'flex-end'} mt={2}>
        <LoadingButton color="primary" 
    // size="medium"
    type="submit" variant="contained" loading={isSubmitting} sx={{ borderRadius: '32px' }}>
          Submit
        </LoadingButton>
      </Stack>
    </FormProvider>);
};
export default StepOneUserInfoForm;
