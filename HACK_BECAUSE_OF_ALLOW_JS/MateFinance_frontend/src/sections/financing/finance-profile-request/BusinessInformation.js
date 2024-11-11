import { useEffect, useMemo, useState } from 'react';
// hook form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';
// @mui
import { Box, IconButton, MenuItem, Stack, Typography, alpha } from '@mui/material';
import { RHFSelect, RHFTextField, RHFUploadBox } from 'src/components/hook-form';
//
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify/iconify';
import axiosInstance, { endpoints } from 'src/utils/axios';
import getBase64 from 'src/utils/getBase64';
// component
import ViewAttachments from 'src/components/view-attachment/index';
import { lang } from 'src/locales/multiLang';
import { useLocales } from 'src/locales';
import { useSelector } from 'react-redux';
export default function BusinessInformation({ action, completed, userFinance }) {
    const { auth: { userAttachments }, } = useSelector((state) => state);
    const [businessTypes, setBusinessTypes] = useState([]);
    // created because to show realtime on screen
    const [bankStatement, setBankStatement] = useState('');
    const [viewFile, setviewFile] = useState('');
    const BasicInfoSchema = Yup.object().shape({
        businessName: Yup.string().required(),
        businessAddress: Yup.string().required(),
        businessType: Yup.string().required(),
        monthlyTurnover: Yup.number().required().typeError('Must be a number').min(0),
        ntn: Yup.string().required(),
        CardName: Yup.string(),
        CardNumber: Yup.string(),
        statement: Yup.string().required(),
    });
    const defaultValues = useMemo(() => ({
        businessName: '',
        businessAddress: '',
        businessType: '',
        monthlyTurnover: '',
        ntn: '',
        CardName: '',
        CardNumber: '',
        statement: '',
    }), []);
    const methods = useForm({
        resolver: yupResolver(BasicInfoSchema),
        defaultValues,
    });
    const { reset, getValues, setValue, handleSubmit, formState: { isSubmitting }, } = methods;
    const handleSave = async () => {
        const { businessName, businessAddress, businessType, monthlyTurnover, ntn, CardName, CardNumber, statement, } = getValues();
        try {
            await axiosInstance.post(endpoints.finance.businessInformation, {
                businessName,
                businessType,
                businessAddress,
                monthlyTurnover,
                ntn,
                cardTitle: CardName,
                cardNo: CardNumber,
                monthBankStatement: statement,
            });
            completed.onTrue();
            enqueueSnackbar('Saved!');
        }
        catch (error) {
            enqueueSnackbar(error.toString(), { variant: 'error' });
        }
    };
    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0]; // Assuming you only accept one file, change this if needed
        if (file === undefined)
            enqueueSnackbar('Invalid file type', { variant: 'error' });
        const base64 = await getBase64(file);
        setBankStatement(base64);
        setValue('statement', base64);
    };
    const { statement } = getValues();
    const businesstype = async () => {
        const business = await axiosInstance.get(endpoints.businessTypes);
        setBusinessTypes(business);
    };
    useEffect(() => {
        businesstype();
    }, []);
    useEffect(() => {
        if (userFinance.businessName || userFinance.businessAddress) {
            setValue('businessName', userFinance.businessName);
            setValue('businessAddress', userFinance.businessAddress);
            setValue('businessType', userFinance.businessType);
            setValue('monthlyTurnover', userFinance.monthlyTurnover);
            setValue('ntn', userFinance.ntn);
            setValue('CardName', userFinance.cardTitle);
            setValue('CardNumber', userFinance.cardNo);
            setValue('statement', userFinance.monthBankStatement);
            setBankStatement(userFinance.monthBankStatement);
            //
            completed.onTrue();
        }
    }, []);
    const viewAttachment = (file) => {
        setviewFile(true);
    };
    const closeAttViewModal = () => {
        setviewFile(false);
    };
    const { t } = useLocales();
    function checkType(string) {
        // Check if the string is a base64 encoded file.
        const contentType = string?.includes('base64');
        // Check if the string is a URL.
        if (isURL(string)) {
            return 'URL';
        }
        if (contentType) {
            return 'base64';
        }
        return 'empty';
    }
    function isURL(string) {
        // A URL must start with either "http://" or "https://".
        return string.includes('bankstatements');
    }
    return (<Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleSave)}>
        <Typography variant="h5" align="center" gutterBottom>
          {t(`${lang.financing}.bussinessInformation`)}
        </Typography>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1.5 }}>
          <RHFTextField name="businessName" label={t(`${lang.financing}.bussinessName`)}/>
          <RHFSelect name="businessType" label={t(`${lang.financing}.bussinessType`)}>
            {businessTypes.map((item) => (<MenuItem key={item.categoryName} value={item.categoryName}>
                {' '}
                {item.categoryName}
              </MenuItem>))}
          </RHFSelect>
          <RHFTextField name="businessAddress" label={t(`${lang.financing}.bussinessAddress`)}/>
        </Stack>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1.5 }}>
          <RHFTextField name="monthlyTurnover" label={t(`${lang.financing}.monthlyTurnOver`)} type="number"/>
          <RHFTextField name="ntn" label={t(`${lang.financing}.ntn`)}/>
        </Stack>
        <Typography variant="h5" align="center" gutterBottom>
          {t(`${lang.financing}.debit_creditCardDetail`)}
        </Typography>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1.5 }}>
          <RHFTextField name="CardName" label={t(`${lang.financing}.cardTitle`)}/>
          <RHFTextField name="CardNumber" label={t(`${lang.financing}.cardNumber`)} type="number"/>
        </Stack>
        <Typography variant="h5" align="center" gutterBottom>
          {t(`${lang.financing}.sixMonthBankStatement`)}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1.5 }}>
          <RHFUploadBox onDrop={(acceptedfile) => onDrop(acceptedfile)} name="statement" label={t(`${lang.financing}.sixMonthBankStatement`)} sx={{
            mb: 3,
            p: 2.5,
            // width: 'auto',
            height: '100px',
            borderRadius: 1.5,
        }} placeholder={<Stack spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                <Iconify icon="eva:cloud-upload-fill" width={40}/>
                <Typography variant="body2">{t(`${lang.financing}.bankStatment`)}</Typography>
              </Stack>}/>
          {bankStatement && (<Box sx={{
                m: 0.5,
                width: 100,
                height: 100,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                cursor: 'pointer',
                alignItems: 'center',
                color: 'text.disabled',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.16)}`,
            }}>
              <Iconify icon="iconamoon:attachment-duotone" width={28}/>

              <Box sx={{ justifyContent: 'space-between' }}>
                <IconButton onClick={() => viewAttachment(statement)}>
                  <Iconify icon="carbon:view-filled" width={18}/>
                </IconButton>
              </Box>
            </Box>)}
        </Stack>
        {action}
      </FormProvider>

      {/*  */}
      <ViewAttachments open={viewFile} setOpen={closeAttViewModal} 
    // attachment={{ data: `${userAttachments.url}${statement}${userAttachments.token}` }}
    attachment={{
            data: checkType(statement) === 'base64' || checkType(statement) === 'empty'
                ? statement
                : `${userAttachments.url}${statement}${userAttachments.token}`,
        }}/>
    </Box>);
}
