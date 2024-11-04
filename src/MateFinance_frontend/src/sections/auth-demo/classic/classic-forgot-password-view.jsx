import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSnackbar } from 'src/components/snackbar';

import { PasswordIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { InputAdornment } from '@mui/material';

// ----------------------------------------------------------------------

export default function ClassicForgotPasswordView() {
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.forgotPassword, {
        email: data.email,
      });
      enqueueSnackbar('Email Sent Successfully', {
        variant: 'success',
      });
      router.push(paths.auth.jwt.login);
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="email"
        label="Email address"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'mdi:email-outline'} />
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="primary"
        sx={{ borderRadius: '32px' }}
        loading={isSubmitting}
      >
        Send Request
      </LoadingButton>

      <Stack direction="row" justifyContent="center" spacing={0.5}>
        <Typography variant="body2">Remembered your password?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.login} variant="subtitle2">
          Log in
        </Link>
      </Stack>

      {/* <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link> */}
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">
          Forgot your <br /> Password?
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
