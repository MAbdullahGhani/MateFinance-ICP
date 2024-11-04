import { Box, Button, Drawer, IconButton, List, MenuItem, Typography } from '@mui/material';
import CustomPhoneNumberField from 'src/components/phone-number-input/custom-phone-number-field';
// @mui
// components
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar';

import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/system';
import { useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useSelector } from 'react-redux';
import axios, { endpoints } from 'src/utils/axios';
import * as Yup from 'yup';

export default function Guarantor({ drawer }) {
  const {
    user: {
      userFinance: { guarantorDetails, creditScore },
    },
  } = useSelector((state) => state);
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
  // ------------------------------------
  const NewDetailSchema = Yup.object().shape({
    name1: Yup.string().required('Name is required'),
    name2: Yup.string().required('Name is required'),
    //
    cnic1: Yup.string().min(11, 'Invalid CNIC Number').required('CNIC is required'),
    cnic2: Yup.string()
      .min(11, 'Invalid CNIC Number')
      .required('CNIC is required')
      .notOneOf([Yup.ref('cnic1')], 'Cannot be the same cnic'),
    //
    relationShip1: Yup.string().required('Required'),
    relationShip2: Yup.string()
      .required('Required')
      .notOneOf([Yup.ref('relationShip1')], 'Cannot be the same'),
    //
    phone1: Yup.string().test('phone1', 'Invalid Phone Number', (value) => {
      return isValidPhoneNumber(value);
    }),
    phone2: Yup.string()
      .test('phone2', 'Invalid Phone Number', (value) => {
        return isValidPhoneNumber(value);
      })
      .notOneOf([Yup.ref('phone1')], 'Cannot be the same mobile number'),
  });

  const defaultValues = useMemo(() => ({
    relationShip1: '',
    name1: '',
    phone1: '',
    cnic1: '',
    relationShip2: '',
    name2: '',
    phone2: '',
    cnic2: '',
  }));

  const methods = useForm({
    resolver: yupResolver(NewDetailSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;
  const { phone1, phone2 } = getValues();

  const handleSave = async (params) => {
    try {
      const res = await axios.post(endpoints.finance.guarantor, {
        contact1name: params.name1,
        contact1Cnic: params.cnic1,
        contact1mobileNumber: params.phone1,
        contact1relationShip: params.relationShip1,
        contact2name: params.name2,
        contact2Cnic: params.cnic2,
        contact2mobileNumber: params.phone2,
        contact2relationShip: params.relationShip2,
      });
      reset();
      drawer.onFalse();

      enqueueSnackbar('Guarantor detail submitted successfully!');
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  useEffect(() => {
    setValue('relationShip1', guarantorDetails?.guarantor1?.relationShip);
    setValue('name1', guarantorDetails?.guarantor1?.name);
    setValue('phone1', guarantorDetails?.guarantor1?.mobileNumber);
    setValue('cnic1', guarantorDetails?.guarantor1?.cnic);
    //
    setValue('relationShip2', guarantorDetails?.guarantor2?.relationShip);
    setValue('name2', guarantorDetails?.guarantor2?.name);
    setValue('phone2', guarantorDetails?.guarantor2?.mobileNumber);
    setValue('cnic2', guarantorDetails?.guarantor2?.cnic);
  }, [guarantorDetails?.guarantor1]);
  const renderList = (
    <Scrollbar>
      <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Guarantor Detail
          </Typography>
          <IconButton onClick={drawer.onFalse}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
      </Stack>

      <FormProvider methods={methods} onSubmit={handleSubmit(handleSave)}>
        <List disablePadding>
          <Box
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
            sx={{ my: 4, px: 3 }}
          >
            <Typography variant="h6">Guarantor Contact 1</Typography>
            <div>
              <RHFSelect
                name="relationShip1"
                label="Relationship"
                // onChange={(e) => setValue('relationShip', e.target.value)}
              >
                {relationship1.map((rel) => (
                  <MenuItem value={rel.name} key={rel.name}>
                    {rel.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </div>
            <div>
              <RHFTextField
                name="name1"
                label="Name"
                // onChange={(e) => setValue('name', e.target.value)}
              />
            </div>
            <div>
              {' '}
              <CustomPhoneNumberField
                name="phone1"
                label="Mobile Number"
                value={phone1}
                onChange={(e) => setValue('phone1', e)}
                validerror={methods?.formState?.errors}
              />
            </div>
            <div>
              {' '}
              <RHFTextField
                name="cnic1"
                type="number"
                label="CNIC"
                // onChange={(e) => setValue('phone', e.target.value)}
              />
            </div>
          </Box>
        </List>
        {/* 2nd Guarantor Contact  */}
        <List disablePadding>
          <Box
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
            sx={{ my: 4, px: 3 }}
          >
            <Typography variant="h6">Guarantor Contact 2</Typography>
            <div>
              <RHFSelect
                name="relationShip2"
                label="Relationship"
                // onChange={(e) => setValue('relationShip', e.target.value)}
              >
                {relationship2.map((rel) => (
                  <MenuItem value={rel.name} key={rel.name}>
                    {rel.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </div>
            <div>
              <RHFTextField
                name="name2"
                label="Name"
                // onChange={(e) => setValue('name', e.target.value)}
              />
            </div>
            <div>
              {' '}
              <CustomPhoneNumberField
                name="phone2"
                label="Mobile Number"
                value={phone2}
                onChange={(e) => setValue('phone2', e)}
                validerror={methods?.formState?.errors}
              />
            </div>
            <div>
              {' '}
              <RHFTextField
                name="cnic2"
                type="number"
                label="CNIC"
                // onChange={(e) => setValue('phone', e.target.value)}
              />
            </div>
          </Box>
        </List>
        <Box
          className="drawer_bottom_glow_box"
          sx={{
            py: 1,
            px: 3,
          }}
        >
          <LoadingButton
            sx={{ mx: 1 }}
            size="medium"
            color="primary"
            variant="contained"
            type="submit"
            // loading={requestLoding.value}
            disabled={
              guarantorDetails?.guarantor1?.name && creditScore?.guarantor?.action !== 'Correction'
            }
            // onClick={() => {
            //   RequestLoan();
            // }}
          >
            Save
          </LoadingButton>
          <Button variant="outlined" size="medium" color="error" onClick={drawer.onFalse}>
            Cancel
          </Button>
        </Box>
      </FormProvider>
    </Scrollbar>
  );
  return (
    <div>
      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: { xs: 400, sm: 500 } },
        }}
      >
        {renderList}
      </Drawer>
    </div>
  );
}
