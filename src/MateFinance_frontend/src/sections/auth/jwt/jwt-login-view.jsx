import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN, RECAPTCHA_KEY } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import ReCAPTCHA from 'react-google-recaptcha';
import { InputLabel } from '@mui/material';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // if (!recaptchaToken) {
    //   setErrorMsg('Recaptcha token is required');
    //   return;
    // }
    try {
      setErrorMsg('');
      await login?.(data.email, data.password, router);

      // router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={1} sx={{ mb: 5 }}>
      <Typography variant="h4">Log in</Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="caption" display="block" gutterBottom color={'#667085'}>
          Welcome back! Please enter your details.
        </Typography>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack>
        <InputLabel sx={{ color: 'black' }}>Email</InputLabel>
        <RHFTextField
          name="email"
          InputLabelProps={{ shrink: true }}
          placeholder="Enter your email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'mdi:email-outline'} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack>
        <InputLabel sx={{ color: 'black' }}>Password</InputLabel>
        <RHFTextField
          name="password"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'solar:lock-outline'} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Link
        variant="body2"
        color="primary"
        sx={{ alignSelf: 'flex-end', fontWeight: 600 }}
        component={RouterLink}
        href={paths.auth.jwt.forgotPassword}
      >
        Forgot password?
      </Link>

      <ReCAPTCHA
        sitekey={RECAPTCHA_KEY}
        onChange={(value) => {
          setRecaptchaToken(value);
        }}
      />
      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        sx={{ borderRadius: '32px' }}
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
      >
        Login
      </LoadingButton>
      <Stack direction="row" justifyContent="center" spacing={0.5}>
        <Typography variant="body2">Don’t have an account?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.validRegister} variant="subtitle2">
          Create an account
        </Link>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
      </Alert> */}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
