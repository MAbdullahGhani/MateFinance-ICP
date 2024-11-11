import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuthContext } from 'src/auth/hooks';
import { fData } from 'src/utils/format-number';
import { countries } from 'src/assets/data';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFUploadAvatar, RHFAutocomplete, } from 'src/components/hook-form';
import { ATTACHMENT_TOKEN, ATTACHMENT_URL, IM_HOST_API } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';
import axios from 'axios';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { LENDER_STATUS_OPTIONS } from 'src/_mock';
// ----------------------------------------------------------------------
export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar();
    const { user, authenticated } = useAuthContext();
    const UpdateUserSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('First Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        photoURL: Yup.mixed().nullable(),
        phoneNumber: Yup.string().required('Phone number is required'),
        country: Yup.string().required('Country is required'),
        address: Yup.string(),
        state: Yup.string(),
        city: Yup.string().required('City is required'),
        zipCode: Yup.string(),
        about: Yup.string(),
        status: Yup.string(),
        // not required
        isPublic: Yup.boolean(),
        cityListData: Yup.array(),
        profilePicture: Yup.object(),
    });
    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        photoURL: null,
        phoneNumber: '',
        country: '',
        address: '',
        state: '',
        city: '',
        zipCode: '',
        about: '',
        isPublic: false,
        status: '',
        profilePicture: {},
        //
        cityListData: [],
    };
    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, formState: { isSubmitting }, } = methods;
    const values = watch();
    useEffect(() => {
        getLenderDetails();
    }, []);
    const getLenderDetails = async () => {
        try {
            const response = await axiosInstance.get(`${endpoints.app.getLenderById}?id=${user?.id}`);
            let lender = response?.lender[0];
            const country = countries.find((element) => element.label === lender?.country);
            // src={ATTACHMENT_URL + lender?.profilePicture[0]?.attachmentURL + ATTACHMENT_TOKEN}
            getCityList(country?.code);
            setValue('status', lender?.status);
            setValue('firstName', lender?.firstName);
            setValue('lastName', lender?.lastName);
            setValue('email', lender?.email);
            setValue('phoneNumber', lender?.mobileNumber);
            setValue('country', lender?.country);
            setValue('city', lender?.geoLocation?.city);
            if (lender?.profilePicture?.length > 0) {
                setValue('photoURL', ATTACHMENT_URL + lender?.profilePicture[0]?.attachmentURL + ATTACHMENT_TOKEN);
                setValue('profilePicture', lender?.profilePicture[0] || {});
            }
        }
        catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
        }
    };
    const getCityList = async (params) => {
        const data = {
            country: params,
        };
        try {
            const response = await axios.post(IM_HOST_API + endpoints.auth.getCity, data);
            let noCities = response?.data.some((obj) => obj.name === 'No cities');
            if (noCities) {
                setValue('cityListData', []);
                return;
            }
            setValue('cityListData', response?.data || []);
        }
        catch (error) {
            console.error(error);
        }
    };
    const onSubmit = handleSubmit(async (data) => {
        try {
            let payload = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                country: data?.country,
                city: data?.city,
                profilePicture: data?.photoURL?.preview
                    ? [
                        {
                            attachmentTitle: data?.photoURL?.name,
                            attachmentPath: data?.photoURL?.dataURL,
                            attachmentURL: data?.photoURL?.dataURL,
                            base64: data?.photoURL?.dataURL,
                            name: data?.photoURL?.name,
                            type: data?.photoURL?.type,
                        },
                    ]
                    : [data?.profilePicture],
            };
            const response = await axiosInstance.put(endpoints.app.updateLenderGenInfo, payload);
            enqueueSnackbar(response?.message);
        }
        catch (error) {
            console.error(error);
        }
    });
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
                setValue('photoURL', newFile, { shouldValidate: true });
            }
        };
        reader.readAsDataURL(file);
    }, [setValue]);
    return (<FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack mb={1}>
              <Label sx={{ alignSelf: 'end' }} variant="soft" color={(values.status === 'approve' && 'success') ||
            (values.status === 'needMoreDetails' && 'warning') ||
            (values.status === 'rejected' && 'error') ||
            'info'}>
                {LENDER_STATUS_OPTIONS?.find((x) => x.value === values.status)?.label}
              </Label>
            </Stack>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
        }}>
              <RHFTextField name="email" label="Email Address" disabled/>
              <RHFTextField name="phoneNumber" label="Phone Number" disabled/>
              <RHFTextField name="firstName" label="First Name"/>
              <RHFTextField name="lastName" label="Last Name"/>
              {/* <RHFTextField name="address" label="Address" /> */}

              <RHFAutocomplete name="country" type="country" label="Country" placeholder="Choose a country" options={countries.map((option) => option.label)} getOptionLabel={(option) => option} getCity={getCityList}/>

              <RHFAutocomplete label="City" name="city" autoHighlight clearable options={values.cityListData?.map((option) => option?.name) || []} getOptionLabel={(option) => option} renderOption={(params, option) => (<li {...params} key={option}>
                    {option}
                  </li>)}/>

              {/* <RHFTextField name="state" label="State/Region" /> */}
              {/* <RHFTextField name="city" label="City" /> */}
              {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
            </Box>

            <Stack sx={{
            border: '1px solid #EAECF0',
            borderRadius: '8px',
            mt: 3,
            padding: '16px 24px',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            alignSelf: 'stretch',
        }}>
              <RHFUploadAvatar name="photoURL" maxSize={3145728} onDrop={handleDrop} helperText={<Typography variant="caption" sx={{
                mt: 3,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.disabled',
            }}>
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>}/>
            </Stack>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton color="primary" type="submit" variant="contained" loading={isSubmitting} startIcon={<Iconify icon="material-symbols:save-outline"/>}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>);
}
