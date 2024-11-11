import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { SentIcon } from 'src/assets/icons';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode, RHFTextField } from 'src/components/hook-form';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------
export default function ClassicNewPasswordView() {
    const password = useBoolean();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get('id');
    const NewPasswordSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match'),
    });
    const defaultValues = {
        code: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(NewPasswordSchema),
        defaultValues,
    });
    const { handleSubmit, formState: { isSubmitting }, } = methods;
    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await axiosInstance.post(endpoints.auth.newPassword, {
                token: id,
                password: data.password,
            });
            enqueueSnackbar('Password changed Successfully', {
                variant: 'success',
            });
            router.push(paths.auth.jwt.login);
        }
        catch (error) {
            enqueueSnackbar(error, {
                variant: 'error',
            });
        }
    });
    const renderForm = (<Stack spacing={3} alignItems="center">
      {/* <RHFTextField
          name="email"
          label="Email"
          placeholder="example@gmail.com"
          InputLabelProps={{ shrink: true }}
        /> */}

      {/* <RHFCode name="code" /> */}

      <RHFTextField name="password" label="Password" type={password.value ? 'text' : 'password'} InputProps={{
            endAdornment: (<InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}/>
              </IconButton>
            </InputAdornment>),
        }}/>

      <RHFTextField name="confirmPassword" label="Confirm New Password" type={password.value ? 'text' : 'password'} InputProps={{
            endAdornment: (<InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}/>
              </IconButton>
            </InputAdornment>),
        }}/>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Update Password
      </LoadingButton>

      {/* <Typography variant="body2">
          {`Don’t have a code? `}
          <Link
            variant="subtitle2"
            sx={{
              cursor: 'pointer',
            }}
          >
            Resend code
          </Link>
        </Typography> */}

      <Link component={RouterLink} href={paths.auth.jwt.login} color="inherit" variant="subtitle2" sx={{
            alignItems: 'center',
            display: 'inline-flex',
        }}>
        <Iconify icon="eva:arrow-ios-back-fill" width={16}/>
        Return to sign in
      </Link>
    </Stack>);
    const renderHead = (<>
      <SentIcon sx={{ height: 96 }}/>

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Enter New Password</Typography>
      </Stack>
    </>);
    return (<FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>);
}
