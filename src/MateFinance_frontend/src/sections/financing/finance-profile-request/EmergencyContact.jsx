import { useEffect, useMemo, useState } from 'react';
// hook form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';

// @mui
import { Box, Grid, MenuItem, Typography } from '@mui/material';
// @utils
import { enqueueSnackbar } from 'notistack';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import CustomPhoneNumberField from 'src/components/phone-number-input/custom-phone-number-field';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { lang } from 'src/locales/multiLang';
import { useLocales } from 'src/locales';

const relationship1 = [
  { name: 'Mother' },
  { name: 'Father' },
  { name: 'Sister' },
  { name: 'Brother' },
  { name: 'Parent' },
  { name: 'Spouse' },
  { name: 'Business Partner' },
  { name: 'Friend' },
];
const relationship2 = [
  { name: 'Mother' },
  { name: 'Father' },
  { name: 'Sister' },
  { name: 'Brother' },
  { name: 'Parent' },
  { name: 'Spouse' },
  { name: 'Child' },
  { name: 'Friend' },
  { name: 'Business Partner' },
];

export default function EmergencyContact({ action, completed, userFinance }) {
  const BasicInfoSchema = Yup.object().shape({
    contactName1: Yup.string().required('Required'),
    contactName2: Yup.string().required('Required'),
    contactRelation1: Yup.string().required('Required'),
    contactRelation2: Yup.string()
      .required('Required')
      .notOneOf([Yup.ref('contactRelation1')], 'Cannot be the same as Contact Relation 1'),
    contactPhone1: Yup.string().test('contactPhone1', 'Invalid Phone Number', (value) =>
      isValidPhoneNumber(value)
    ),
    contactPhone2: Yup.string()
      .test('contactPhone2', 'Invalid Phone Number', (value) => isValidPhoneNumber(value))
      .notOneOf([Yup.ref('contactPhone1')], 'Cannot be the same as Contact Phone 1'),
  });
  const defaultValues = useMemo(
    () => ({
      contactName1: '',
      contactName2: '',
      contactRelation1: '',
      contactRelation2: '',
      contactPhone1: '',
      contactPhone2: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(BasicInfoSchema),
    defaultValues,
  });

  const {
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [phone1, setphone1] = useState('');
  const [phone2, setphone2] = useState('');

  const handleSave = async (params) => {
    try {
      await axiosInstance.post(endpoints.finance.contactInfo, {
        contact1name: params.contactName1,
        contact1mobileNumber: params.contactPhone1,
        contact1relationShip: params.contactRelation1,
        contact2name: params.contactName2,
        contact2mobileNumber: params.contactPhone2,
        contact2relationShip: params.contactRelation2,
      });
      enqueueSnackbar('Saved!');
      completed.onTrue();
    } catch (error) {
      enqueueSnackbar(error.toString(), { variant: 'error' });
    }
  };

  useEffect(() => {
    if (userFinance?.emergencyContact1?.name || userFinance?.emergencyContact2?.name) {
      setValue('contactName1', userFinance?.emergencyContact1?.name);
      setValue('contactName2', userFinance?.emergencyContact2?.name);
      //
      setValue('contactRelation1', userFinance?.emergencyContact1?.relationShip);
      setValue('contactRelation2', userFinance?.emergencyContact2?.relationShip);
      //
      setValue('contactPhone1', userFinance?.emergencyContact1?.mobileNumber);

      setValue('contactPhone2', userFinance?.emergencyContact2?.mobileNumber);

      // jugarrr;
      setphone1(userFinance?.emergencyContact1?.mobileNumber);
      setphone2(userFinance?.emergencyContact1?.mobileNumber);
      //
      completed.onTrue();
    }
  }, [userFinance?.emergencyContact1?.mobileNumber]);

  const { t } = useLocales();
  return (
    <Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleSave)}>
        <Typography variant="h5" align="center" gutterBottom>
          {t(`${lang.financing}.emergencyContact1`)}
        </Typography>
        <Grid container spacing={1} sx={{ p: 1.5 }}>
          <Grid item xs={12} sm={4}>
            <RHFSelect name="contactRelation1" label={t(`${lang.financing}.relationShip`)}>
              {relationship1.map((rel) => (
                <MenuItem value={rel.name} key={rel.name}>
                  {rel.name}
                </MenuItem>
              ))}
            </RHFSelect>
          </Grid>
          <Grid item xs={12} sm={4}>
            <RHFTextField name="contactName1" label={t(`${lang.financing}.name`)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomPhoneNumberField
              name="contactPhone1"
              label="Mobile Number"
              value={phone1}
              onChange={(e) => setValue('contactPhone1', e)}
              validerror={methods?.formState?.errors}
            />
          </Grid>
        </Grid>

        <Typography variant="h5" align="center" gutterBottom>
          {t(`${lang.financing}.emergencyContact2`)}
        </Typography>
        <Grid container spacing={1} sx={{ p: 1.5 }}>
          <Grid item xs={12} sm={4}>
            <RHFSelect name="contactRelation2" label={t(`${lang.financing}.relationShip`)}>
              {relationship2.map((rel) => (
                <MenuItem value={rel.name} key={rel.name}>
                  {rel.name}
                </MenuItem>
              ))}
            </RHFSelect>
          </Grid>
          <Grid item xs={12} sm={4}>
            <RHFTextField name="contactName2" label={t(`${lang.financing}.name`)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomPhoneNumberField
              name="contactPhone2"
              label="Mobile Number"
              value={phone2}
              onChange={(e) => setValue('contactPhone2', e)}
              validerror={methods?.formState?.errors}
            />
          </Grid>
        </Grid>

        {action}
      </FormProvider>
    </Box>
  );
}
