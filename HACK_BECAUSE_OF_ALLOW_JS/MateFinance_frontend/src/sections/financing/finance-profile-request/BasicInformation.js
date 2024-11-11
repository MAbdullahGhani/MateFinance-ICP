import { useEffect, useMemo } from 'react';
// hook form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';
// @mui
import { Box, Stack, Typography } from '@mui/material';
// utils
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import { RHFTextField } from 'src/components/hook-form';
import axios, { endpoints } from 'src/utils/axios';
import { lang } from 'src/locales/multiLang';
import { useLocales } from 'src/locales';
export default function BasicInformation({ userInfo, setUserInfo, action, completed, userFinance, }) {
    const { t } = useLocales();
    const BasicInfoSchema = Yup.object().shape({
        fullname: Yup.string().required('Full Name no is required'),
        fathername: Yup.string().required('Father Name no is required'),
        cnic: Yup.string().min(13, 'Invalid Cnic').required('CNIC Required'),
        homeaddress: Yup.string().required('Home Address Required'),
        dateOfBirth: Yup.date().required('Date Of Birth Required'),
    });
    const defaultValues = useMemo(() => ({
        fullname: '',
        fathername: '',
        cnic: '',
        homeaddress: '',
        dateOfBirth: '',
    }), []);
    const methods = useForm({
        resolver: yupResolver(BasicInfoSchema),
        defaultValues,
    });
    const { getValues, setValue, handleSubmit, formState } = methods;
    const handleSave = async (params) => {
        const { cnicFrontImage, cnicBackImage } = userInfo;
        const { cnic, dateOfBirth, fathername, fullname, homeaddress } = getValues();
        setUserInfo((prev) => ({
            ...prev,
            fullName: fullname,
            fatherName: fathername,
            DateOfBirth: dateOfBirth,
            homeAddress: homeaddress,
            cnicNumber: cnic,
        }));
        try {
            await axios.post(endpoints.finance.basicInformation, {
                fullName: fullname,
                fatherName: fathername,
                DateOfBirth: dateOfBirth,
                homeAddress: homeaddress,
                cnicNumber: cnic,
                cnicFrontImage,
                cnicBackImage,
            });
            completed.onTrue();
            enqueueSnackbar('Saved!');
        }
        catch (error) {
            enqueueSnackbar(error.toString(), { variant: 'error' });
        }
    };
    useEffect(() => {
        if (userFinance.cnicFrontImage ||
            userFinance.cnicBackImage ||
            userFinance.DateOfBirth ||
            userFinance.cnicNumber ||
            userFinance.fullName) {
            // @ its setting from user db
            setValue('cnic', userFinance.cnicNumber);
            setValue('dateOfBirth', moment(userFinance.DateOfBirth, 'YYYY-MM-DD').format('YYYY-MM-DD') || '');
            setValue('fathername', userFinance.fatherName);
            setValue('fullname', userFinance.fullName);
            setValue('homeaddress', userFinance.homeAddress);
            //
            completed.onTrue();
        }
        else {
            // @ its setting from fresh , first time
            setValue('cnic', userInfo.cnicNumber);
            setValue('dateOfBirth', moment(userInfo.DateOfBirth, 'DD-MM-YYYY').format('YYYY-MM-DD') || '');
            setValue('fathername', userInfo.fatherName);
            setValue('fullname', userInfo.fullName);
            setValue('homeaddress', userInfo.homeAddress);
        }
    }, [userFinance]);
    return (<Box>
      <Typography variant="h5" align="center" gutterBottom>
        {t(`${lang.financing}.basicInformation`)}
      </Typography>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleSave)}>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1.5 }}>
          <RHFTextField name="fullname" label={t(`${lang.financing}.fullName`)}/>
          <RHFTextField name="fathername" label={t(`${lang.financing}.fatherName`)}/>
          <RHFTextField name="dateOfBirth" label={t(`${lang.financing}.dateOfBirth`)} type="date"/>
        </Stack>

        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1.5 }}>
          <RHFTextField name="cnic" label={t(`${lang.financing}.CNIC`)}/>
          <RHFTextField name="homeaddress" label={t(`${lang.financing}.homeAddress`)}/>
        </Stack>
        {action}
      </FormProvider>
    </Box>);
}
