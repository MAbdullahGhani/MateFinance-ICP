import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { IM_HOST_API, PATH_AFTER_LOGIN, RECAPTCHA_KEY } from 'src/config-global';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { countries } from 'src/assets/data';
import ValidPhoneInput from 'src/components/phone-number-input';
import { noWhiteSpaces } from 'src/utils/yup-validate';
import axiosApi, { endpoints } from 'src/utils/axios';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
// ----------------------------------------------------------------------
export default function JwtRegisterView() {
    const { register } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [resIPData, setResIPData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');
    const password = useBoolean();
    const confirmPassword = useBoolean();
    const isUsSelected = useBoolean();
    const showUsSelected = useBoolean();
    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First name required')
            .test('noWhitespace', 'No whitespace before or after text', noWhiteSpaces),
        lastName: Yup.string()
            .required('Last name required')
            .test('noWhitespace', 'No whitespace before or after text', noWhiteSpaces),
        email: Yup.string()
            .required('Email is required')
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email address'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least six characters long'),
        // confirmPassword: Yup.string()
        //   .required('Confirm Password is required')
        //   .oneOf([Yup.ref('password')], 'Passwords must match'),
        country: Yup.string().required('required field'),
        city: Yup.string().required('required field'),
        phoneNumber: Yup.string()
            .test('valid', 'Invalid phone number', function (value) {
            const { phoneNumber } = this.parent;
            const phoneRegex = /^\+?\d{10,}$/;
            return phoneRegex.test(phoneNumber);
        })
            .required('Phone number is required'),
        primary: Yup.boolean().oneOf([true], 'Checkbox is required'),
        // not required
        cityListData: Yup.array(),
    });
    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        businessName: '',
        country: '',
        city: '',
        phoneNumber: '',
        primary: false,
        //
        cityListData: [],
    };
    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });
    const { control, watch, reset, getValues, setValue, handleSubmit, formState: { isSubmitting, errors }, } = methods;
    const values = watch();
    const selectedCountry = watch('country');
    const selectedPhoneNumber = watch('phoneNumber');
    const getCountryCode = () => {
        const country = countries.find((element) => element.label === selectedCountry);
        return country?.code;
    };
    useEffect(() => {
        getIP();
    }, []);
    useEffect(() => {
        // Fetch country based on the phoneNumber
        const fetchCountryByPhoneNumber = async () => {
            try {
                // fetch country based on phoneNumber
                const phoneNumber = countries.find((element) => element.phone === selectedPhoneNumber);
                // Update the country field
                setValue('country', phoneNumber.label);
            }
            catch (error) {
                console.error(error);
            }
        };
        // Watch changes in the phoneNumber field and trigger the fetch
        const phoneNumberWatcher = watch('phoneNumber');
        if (phoneNumberWatcher) {
            fetchCountryByPhoneNumber();
        }
    }, [selectedPhoneNumber]);
    useEffect(() => {
        if (selectedCountry) {
            isUsSelected.onFalse();
            showUsSelected.onFalse();
            if (selectedCountry === 'United States') {
                isUsSelected.onTrue();
                showUsSelected.onTrue();
                return;
            }
            const country = countries.find((element) => element.label === selectedCountry);
            // ** if getIp api response country not same empty the city field
            if (resIPData?.countryName !== selectedCountry) {
                setValue('city', '');
            }
            if (country) {
                setValue('phoneNumber', country.phone);
                getCountryCode();
                getCityList({ countryCode: country.code });
            }
        }
    }, [selectedCountry]);
    const getIP = async () => {
        try {
            const response = await axios.get(endpoints.auth.getIP);
            if (response?.data?.ip) {
                setResIPData(response.data);
                reset({
                    country: response?.data?.countryName,
                    city: response?.data?.city,
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    };
    const getCityList = async (params) => {
        const data = {
            country: params.countryCode,
        };
        try {
            const response = await axios.post(IM_HOST_API + endpoints.auth.getCity, data);
            setValue('cityListData', response?.data || []);
        }
        catch (error) {
            console.error(error);
        }
    };
    const onSubmit = handleSubmit(async (data) => {
        try {
            // if (!recaptchaToken) {
            //   setErrorMsg('Recaptcha Required!');
            //   return;
            // }
            await register?.({ ...data, geoLocation: resIPData });
            enqueueSnackbar('Registered Successfully. Verification email has been sent. Please check your inbox.');
            router.push(paths.auth.jwt.login);
        }
        catch (error) {
            console.error(error);
            reset();
            setErrorMsg(typeof error === 'string' ? error : error.message);
        }
    });
    const renderHead = (<>
      <Stack spacing={2} sx={{ mb: 4, position: 'relative' }}>
        <Stack direction="column">
          <Typography variant="h3"> Create Your Account </Typography>

          <Typography variant="caption" color={'#667085'}>
            Get started with InvoiceMate
          </Typography>
        </Stack>
      </Stack>
    </>);
    const renderTerms = (<Typography component="div" sx={{
            mt: 2.5,
            textAlign: 'center',
            typography: 'caption',
            color: 'text.secondary',
        }}>
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>);
    const renderForm = (<Stack spacing={2.5}>
      <RHFTextField name="email" label="Email address" size="small" InputLabelProps={{ shrink: true }}/>

      <ValidPhoneInput Controller={Controller} control={control} errors={errors} country={getCountryCode()}/>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="firstName" label="First name" size="small" InputLabelProps={{ shrink: true }}/>
        <RHFTextField name="lastName" label="Last name" size="small" InputLabelProps={{ shrink: true }}/>
      </Stack>

      <RHFAutocomplete label="Country" name="country" size="small" clearable options={countries?.map((country) => country?.label) || []} getOptionLabel={(option) => option} renderOption={(params, option) => {
            const { code, label, phone } = countries.filter((country) => country.label === option)[0];
            if (!label) {
                return null;
            }
            return (<li {...params} key={label}>
              <Iconify key={label} icon={`circle-flags:${code.toLowerCase()}`} width={28} sx={{ mr: 1 }}/>
              {label} ({code}) +{phone}
            </li>);
        }}/>

      <RHFAutocomplete label="City" name="city" size="small" autoHighlight clearable options={values.cityListData?.map((option) => option?.name) || []} getOptionLabel={(option) => option} renderOption={(params, option) => (<li {...params} key={option}>
            {option}
          </li>)}/>

      <RHFTextField label="Password" name="password" size="small" type={password.value ? 'text' : 'password'} InputProps={{
            startAdornment: (<InputAdornment position="start">
              <Iconify icon={'solar:lock-outline'} width={15}/>
            </InputAdornment>),
            endAdornment: (<InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}/>
              </IconButton>
            </InputAdornment>),
        }}/>

      {/* <RHFTextField
          label="Confirm Password"
          name="confirmPassword"
          size="small"
          type={confirmPassword.value ? 'text' : 'password'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'solar:lock-outline'} width={15} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={confirmPassword.onToggle} edge="end">
                  <Iconify
                    icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        /> */}
      <RHFCheckbox name="primary" label="I agree with the Terms & Conditions and Privacy Policy"/>

      {/* <ReCAPTCHA
          sitekey={RECAPTCHA_KEY}
          onChange={(value) => {
            setRecaptchaToken(value);
          }}
        /> */}
      <LoadingButton disabled={isUsSelected.value} fullWidth color="primary" size="large" type="submit" variant="contained" sx={{ borderRadius: '32px' }} loading={isSubmitting}>
        Create account
      </LoadingButton>
      <Stack direction="row" justifyContent="center" spacing={0.5}>
        <Typography variant="body2">Already have an account?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.login} variant="subtitle2">
          Log in
        </Link>
      </Stack>
    </Stack>);
    return (<>
      {renderHead}

      {!!errorMsg && (<Alert severity="error" sx={{ m: 3 }}>
          {errorMsg}
        </Alert>)}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      <ConfirmDialog open={showUsSelected.value} onClose={showUsSelected.onFalse} showCancel={true} title={<>Sorry! </>} content="Currently Unavailable in the U.S. - Stay Tuned for Future Expansion!" action={<Button variant="contained" color="primary" onClick={() => {
                showUsSelected.onFalse();
            }}>
            OK
          </Button>}/>
    </>);
}
