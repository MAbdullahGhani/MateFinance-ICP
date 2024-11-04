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

// redux || store
import { useDispatch } from 'react-redux';
import { setUserBanks, updatePaymentChannel } from 'src/redux/slices/user';

// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// utils
import axios, { endpoints } from 'src/utils/axios';

// third party
import ValidPhoneInput from '../../../../../components/phone-number-input';

// ----------------------------------------------------------------------

export default function FormAccountEmailDialog(props) {
  // props
  const { dialog, dialogTitle, userPaymentChannel, paymentChannelUpdate, setPaymentChannelUpdate } =
    props;

  // hooks
  const { enqueueSnackbar } = useSnackbar();

  // redux
  const dispatch = useDispatch();

  // yup validation
  const yupSchema = Yup.object().shape({
    accountName: Yup.string().required('Account name required'),
    email: Yup.string()
      .required('Email is required')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      accountName: paymentChannelUpdate?.accountName || '',
      email: paymentChannelUpdate?.accountNumber || '',
    },
  });

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = useCallback(
    async (data) => {
      let paymentChannel;
      let paymentMethod;

      if (dialogTitle === 'Raast') {
        paymentMethod = dialogTitle;
        paymentChannel = dialogTitle.toLowerCase();
      } else if (dialogTitle === 'Paypal') {
        paymentMethod = 'payPal';
        paymentChannel = 'payPal';
      } else if (dialogTitle === 'Payoneer') {
        paymentMethod = 'payoneer';
        paymentChannel = 'payoneer';
      }

      const obj = {
        paymentmethod: paymentMethod,
        [paymentChannel]: [
          {
            accountTitle: data.accountName,
            accountNumber: data.email,
          },
        ],
      };

      try {
        const response = await axios.post(endpoints.auth.postPaymentInfo, obj);

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
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error, {
          variant: 'error',
        });
      }
    },
    [reset, dialogTitle]
  );

  const onUpdateSubmit = useCallback(
    async (data) => {
      const paymentChannel = 'payPal';
      const paymentMethod = 'payPal';

      const obj = {
        paymentmethod: paymentMethod,
        [paymentChannel]: [
          {
            accountTitle: data.accountName,
            accountNumber: data.email,
          },
        ],
      };
      try {
        const response = await dispatch(
          updatePaymentChannel(
            {
              paymentChannel: paymentMethod,
              accountName: data.accountName,
              accountNumber: data.email,
            },
            obj
          )
        );

        if (response?.msg) {
          enqueueSnackbar(response?.msg, {
            variant: 'success',
          });
          dialog.onFalse();
          reset();
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error, {
          variant: 'error',
        });
      }
    },
    [reset, dialogTitle]
  );

  useEffect(() => {
    if (paymentChannelUpdate?.accountNumber) {
      methods.reset({
        email: paymentChannelUpdate?.accountNumber || '',
        accountName: paymentChannelUpdate?.accountName || '',
      });
    }
  }, [paymentChannelUpdate?.accountNumber]);

  useEffect(() => {
    if (dialog.value === false) {
      reset({
        accountName: '',
        email: '',
      });
      setPaymentChannelUpdate(null);
    }
  }, [dialog.value]);

  return (
    <Dialog open={dialog.value} onClose={dialog.onFalse} maxWidth="xs" fullWidth>
      {paymentChannelUpdate?.accountNumber ? (
        <DialogTitle>Update {dialogTitle} account</DialogTitle>
      ) : (
        <DialogTitle>Add new {dialogTitle} account</DialogTitle>
      )}
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(paymentChannelUpdate?.accountNumber ? onUpdateSubmit : onSubmit)}
      >
        <DialogContent>
          <Box sx={{ width: { sx: 200 } }}>
            <div className="w-100">
              <InputLabel className="my_input_label text-left">Account Name*</InputLabel>
              <RHFTextField name="accountName" size="small" />
            </div>
            <div className="w-100">
              <InputLabel className="my_input_label text-left">Email*</InputLabel>
              <RHFTextField
                name="email"
                size="small"
                disabled={!!paymentChannelUpdate?.accountNumber}
              />
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
    </Dialog>
  );
}
