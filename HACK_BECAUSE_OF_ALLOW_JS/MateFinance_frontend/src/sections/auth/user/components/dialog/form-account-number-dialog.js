import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// utils
import axiosApi, { endpoints } from 'src/utils/axios';
import { noWhiteSpaces } from 'src/utils/yup-validate';
import axios from 'axios';
// redux || store
import { useDispatch } from 'react-redux';
import { setUserBanks, updatePaymentChannel } from 'src/redux/slices/user';
// third party
import ValidPhoneInput from '../../../../../components/phone-number-input';
// ----------------------------------------------------------------------
export default function FormAccountNumberDialog(props) {
    // props
    const { dialog, dialogTitle, paymentChannelUpdate, userPaymentChannel, setPaymentChannelUpdate } = props;
    // hooks
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    // redux
    const dispatch = useDispatch();
    // yup validation
    const UpdateUserSchema = Yup.object().shape({
        accountName: Yup.string()
            .required('Account name required')
            .test('noWhitespace', 'No whitespace before or after text', noWhiteSpaces),
        phoneNumber: Yup.string()
            .test('valid', 'Invalid phone number', function (value) {
            const { phoneNumber } = this.parent;
            const phoneRegex = /^\+?\d{10,}$/;
            return phoneRegex.test(phoneNumber);
        })
            .required('Phone number is required'),
    });
    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues: {
            accountName: paymentChannelUpdate?.accountName || '',
            phoneNumber: paymentChannelUpdate?.accountNumber || 'pk',
        },
    });
    const { control, reset, setValue, handleSubmit, formState: { isSubmitting, errors }, } = methods;
    const onSubmit = useCallback(async (data) => {
        let paymentChannel;
        let paymentMethod;
        let obj;
        if (dialogTitle === 'EasyPaisa') {
            paymentChannel = 'easyPaisa';
            paymentMethod = 'easyPaisa';
        }
        else if (dialogTitle === 'JazzCash') {
            paymentChannel = 'jazzCash';
            paymentMethod = 'jazzCash';
        }
        else if (dialogTitle === 'RAAST') {
            paymentMethod = dialogTitle;
            paymentChannel = 'raast';
        }
        else if (dialogTitle === 'Payoneer') {
            paymentMethod = 'payoneer';
            paymentChannel = 'payoneer';
        }
        if (dialogTitle === 'Payoneer') {
            obj = {
                paymentmethod: paymentMethod,
                [paymentChannel]: [
                    {
                        accountTitle: data.accountName,
                        accountNumber: `+${data.phoneNumber}`,
                    },
                ],
            };
        }
        else {
            obj = {
                paymentmethod: paymentMethod,
                [paymentChannel]: [
                    {
                        accountName: data.accountName,
                        accountNumber: `+${data.phoneNumber}`,
                    },
                ],
            };
        }
        try {
            const response = await axiosApi.post(endpoints.auth.postPaymentInfo, obj);
            if (response?.msg) {
                // create a copy of new changes and update the reducer state
                const updatedUserPaymentChannel = {
                    ...userPaymentChannel,
                    [paymentChannel]: [...userPaymentChannel[paymentChannel], obj[paymentChannel][0]],
                };
                dispatch(setUserBanks(updatedUserPaymentChannel));
                enqueueSnackbar(response?.msg, {
                    variant: 'success',
                });
                dialog.onFalse();
                reset();
            }
        }
        catch (error) {
            console.error(error);
            enqueueSnackbar(error, {
                variant: 'error',
            });
        }
    }, [reset, dialogTitle]);
    const onUpdateSubmit = useCallback(async (data) => {
        let paymentChannel;
        let paymentMethod;
        let obj;
        if (dialogTitle === 'EasyPaisa') {
            paymentChannel = 'easyPaisa';
            paymentMethod = 'easyPaisa';
        }
        else if (dialogTitle === 'JazzCash') {
            paymentChannel = 'jazzCash';
            paymentMethod = 'jazzCash';
        }
        else if (dialogTitle === 'RAAST') {
            paymentMethod = 'RAAST';
            paymentChannel = 'raast';
        }
        else if (dialogTitle === 'Payoneer') {
            paymentMethod = 'payoneer';
            paymentChannel = 'payoneer';
        }
        if (dialogTitle === 'Payoneer') {
            obj = {
                paymentmethod: paymentMethod,
                [paymentChannel]: [
                    {
                        accountTitle: data.accountName,
                        accountNumber: `${data.phoneNumber}`,
                    },
                ],
            };
        }
        else {
            obj = {
                paymentmethod: paymentMethod,
                [paymentChannel]: [
                    {
                        accountName: data.accountName,
                        accountNumber: `${data.phoneNumber}`,
                    },
                ],
            };
        }
        try {
            const response = await dispatch(updatePaymentChannel({
                paymentChannel: paymentMethod === 'RAAST' ? paymentChannel : paymentMethod, // it take paymentChannel 'raast'
                accountName: data.accountName,
                accountNumber: data.phoneNumber,
            }, obj));
            if (response?.msg) {
                enqueueSnackbar(response?.msg, {
                    variant: 'success',
                });
                dialog.onFalse();
                reset();
            }
        }
        catch (error) {
            console.error(error);
            enqueueSnackbar(error, {
                variant: 'error',
            });
        }
    }, [reset, dialogTitle]);
    // useEffect(() => {
    //   if (paymentChannelUpdate?.accountNumber) {
    //     methods.reset({
    //       accountName: paymentChannelUpdate?.accountName || '',
    //       phoneNumber: paymentChannelUpdate?.accountNumber || '',
    //     });
    //   }
    // }, [paymentChannelUpdate?.accountNumber, methods.reset]);
    useEffect(() => {
        if (dialog.value === false) {
            reset({
                accountName: '',
                phoneNumber: '',
            });
            setPaymentChannelUpdate(null);
        }
    }, [dialog.value]);
    const getIP = async () => {
        try {
            const response = await axios.get('https://apiip.net/api/check?accessKey=b388944a-e2bf-4b33-bebd-1d9dc5ffa663');
            if (response?.data?.ip) {
                setValue('phoneNumber', response?.data?.phoneCode);
            }
        }
        catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (dialogTitle === 'Payoneer' && !paymentChannelUpdate?.accountNumber) {
            getIP();
        }
        else if (!paymentChannelUpdate?.accountNumber) {
            setValue('phoneNumber', '92');
        }
    }, []);
    return (<Dialog open={dialog.value} onClose={dialog.onFalse} maxWidth="xs" fullWidth>
      {paymentChannelUpdate?.accountNumber ? (<DialogTitle>Update {dialogTitle} account</DialogTitle>) : (<DialogTitle>Add new {dialogTitle} account</DialogTitle>)}
      <FormProvider methods={methods} onSubmit={handleSubmit(paymentChannelUpdate?.accountNumber ? onUpdateSubmit : onSubmit)}>
        <DialogContent>
          <Box sx={{ width: { sx: 200 } }}>
            <div className="w-100">
              <InputLabel className="my_input_label text-left">Account Name*</InputLabel>
              <RHFTextField name="accountName" size="small"/>
            </div>
            <div className="w-100">
              <InputLabel className="my_input_label text-left">Mobile Number*</InputLabel>
              <ValidPhoneInput Controller={Controller} control={control} errors={errors} 
    // getCountryCode={() => 'pk'}
    // country=""
    // flagDropDown
    disabled={!!paymentChannelUpdate?.accountNumber}/>
            </div>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
            Back
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>);
}
