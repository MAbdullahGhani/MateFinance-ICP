import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// redux || store
import { useDispatch } from 'react-redux';
import { getUserBank, updatePaymentChannel } from 'src/redux/slices/user';
// components
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
// utils
import axios, { endpoints } from 'src/utils/axios';
import { noWhiteSpaces } from 'src/utils/yup-validate';
// ----------------------------------------------------------------------
export default function FormBankAccountDialog(props) {
    // props
    const { dialog, dialogTitle, bankList, paymentChannelUpdate, setPaymentChannelUpdate } = props;
    // hooks
    const { enqueueSnackbar } = useSnackbar();
    // redux
    const dispatch = useDispatch();
    // yup validation
    const UpdateUserSchema = Yup.object().shape({
        bankName: Yup.string().required('field is required'),
        accountTitle: Yup.string()
            .required('field is required')
            .test('noWhitespace', 'No whitespace before or after text', noWhiteSpaces),
        iban: Yup.string(),
        accountNumber: Yup.string().required('Account number is required'),
        branchCode: Yup.string(),
        bankAddress: Yup.string(),
        // .test('noWhitespace', 'No whitespace before or after text', noWhiteSpaces),
    });
    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues: {
            bankName: paymentChannelUpdate?.bankName || '',
            accountTitle: paymentChannelUpdate?.accountTitle || '',
            iban: paymentChannelUpdate?.iBAN || '',
            accountNumber: paymentChannelUpdate?.accountNumber || '',
            branchCode: paymentChannelUpdate?.branchCode || '',
            bankAddress: paymentChannelUpdate?.bankAddress || '',
        },
    });
    const { reset, handleSubmit, formState: { isSubmitting, errors }, } = methods;
    const onSubmit = useCallback(async (data) => {
        const obj = {
            paymentmethod: 'bankAccounts',
            bankAccounts: [
                {
                    bankName: data.bankName,
                    bankAddress: data.bankAddress.trim(),
                    branchCode: data.branchCode,
                    accountTitle: data.accountTitle,
                    iBAN: data.iban,
                    accountNumber: data.accountNumber,
                },
            ],
        };
        try {
            const response = await axios.post(endpoints.auth.postPaymentInfo, obj);
            if (response) {
                // create a copy of new changes and update the reducer state
                // const updatedUserPaymentChannel = {
                //   ...userPaymentChannel,
                //   bankTransfer: [...userPaymentChannel.bankTransfer, obj.bankAccounts],
                // };
                // dispatch(setUserBanks(updatedUserPaymentChannel));
                dispatch(getUserBank());
                enqueueSnackbar('Bank Account Added Successfully');
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
        const obj = {
            paymentmethod: 'bankAccounts',
            bankAccounts: [
                {
                    bankName: data.bankName,
                    bankAddress: data.bankAddress,
                    branchCode: data.branchCode,
                    accountTitle: data.accountTitle,
                    iBAN: data.iban,
                    accountNumber: data.accountNumber,
                },
            ],
        };
        try {
            const response = await dispatch(updatePaymentChannel({
                paymentChannel: 'bankAccounts',
                accountName: data.bankName,
                accountNumber: data.accountNumber,
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
    //       bankName: paymentChannelUpdate.bankName || '',
    //       accountTitle: paymentChannelUpdate.accountTitle || '',
    //       iban: paymentChannelUpdate.iBAN || '',
    //       accountNumber: paymentChannelUpdate.accountNumber || '',
    //       branchCode: paymentChannelUpdate.branchCode || '',
    //       bankAddress: paymentChannelUpdate.bankAddress || '',
    //     });
    //   }
    // }, [paymentChannelUpdate?.accountNumber]);
    useEffect(() => {
        if (dialog.value === false) {
            reset({
                bankName: '',
                accountTitle: '',
                iban: '',
                accountNumber: '',
                branchCode: '',
                bankAddress: '',
            });
            setPaymentChannelUpdate(null);
        }
    }, [dialog.value]);
    return (<div>
      <Dialog open={dialog.value} onClose={dialog.onFalse} maxWidth="xs" fullWidth>
        {console.log(paymentChannelUpdate)}
        {paymentChannelUpdate?.accountNumber ? (<DialogTitle>Update {dialogTitle} Account</DialogTitle>) : (<DialogTitle>Add {dialogTitle} Account</DialogTitle>)}
        <FormProvider methods={methods} onSubmit={handleSubmit(paymentChannelUpdate?.accountNumber ? onUpdateSubmit : onSubmit)}>
          <DialogContent>
            <Box sx={{ width: { sx: 200 }, pt: 1, gap: 2, display: 'flex', flexDirection: 'column' }}>
              <RHFAutocomplete name="bankName" label="Bank Name *" size="small" autoHighlight options={bankList?.map((option) => option?.bankName) || []} getOptionLabel={(option) => option} renderOption={(params, option) => (<li {...params} key={option}>
                    {option}
                  </li>)}/>
              {/* <RHFTextField name="bankName" size="small" label="Bank Name" /> */}
              <RHFTextField name="accountTitle" size="small" label="Account Title *"/>
              <RHFTextField name="iban" size="small" label="IBAN" disabled={!!paymentChannelUpdate?.accountNumber}/>
              <RHFTextField name="accountNumber" size="small" label="Account Number *" disabled={!!paymentChannelUpdate?.accountNumber}/>
              <RHFTextField name="branchCode" size="small" label="Branch Code"/>
              <RHFTextField name="bankAddress" size="small" label="Bank Address"/>
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
      </Dialog>
    </div>);
}
