import { Box, Button, Divider, Paper, Stack, Step, StepLabel, Stepper, Typography, } from '@mui/material';
// utils
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'src/hooks/use-boolean';
import { getUserBank, getUserFinance } from 'src/redux/slices/user';
import axiosInstance, { endpoints } from 'src/utils/axios';
//
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
// @component
import LoadingSpinner from 'src/components/loading-screen/loading-spinner';
import StepThreePaymentMethod from '../../auth/user/step-three-payment-method';
import BasicInformation from '../finance-profile-request/BasicInformation';
import BusinessInformation from '../finance-profile-request/BusinessInformation';
import EmergencyContact from '../finance-profile-request/EmergencyContact';
import UploadCNIC from '../finance-profile-request/UploadCNIC';
import FinanceStatus from '../finance-status-string';
import TrustBox from '../trust-box';
export default function RequestForFinancing() {
    //
    const { t } = useLocales();
    const dispatch = useDispatch();
    const { auth: { userData }, user: { userFinance, userBanksData: { jazzCash, easyPaisa, payPal, raast, payoneer, bankAccounts }, }, } = useSelector((state) => state);
    const getDetails = async () => {
        loading.onTrue();
        await dispatch(getUserBank());
        await dispatch(getUserFinance(userData.userId));
        loading.onFalse();
    };
    useEffect(() => {
        getDetails();
    }, []);
    //
    const [activeStep, setActiveStep] = useState(0);
    const completed = useBoolean();
    const loading = useBoolean();
    const [userInfo, setUserInfo] = useState({
        cnicFrontImage: '',
        cnicBackImage: '',
        fullName: '',
        fatherName: '',
        DateOfBirth: '',
        homeAddress: '',
        cnicNumber: '',
        frontRecognition: false,
        backRecognition: false,
    });
    const [selectedAccount, setSelectedAccount] = useState([]);
    //   *
    const steps = [
        t(`${lang.financing}.uploadCINC`),
        t(`${lang.financing}.basicInformation`),
        t(`${lang.financing}.bussinessInformation`),
        t(`${lang.financing}.contacts`),
        t(`${lang.financing}.accounts`),
    ];
    // *
    useEffect(() => {
        if (userFinance?.applied || userFinance?.cnicFrontImage) {
            completed.onTrue();
        }
        if (userFinance?.creditScore?.basicInfo?.action === 'Correction') {
            completed.onFalse();
        }
    }, [userFinance?.applied]);
    const handleNext = async () => {
        // Check for last step and call API here to save account
        if (activeStep === steps.length - 1) {
            if (!userFinance.applied) {
                if (easyPaisa.length > 0 ||
                    jazzCash.length > 0 ||
                    payPal.length > 0 ||
                    raast.length > 0 ||
                    payoneer.length > 0 ||
                    bankAccounts.length > 0) {
                    debugger;
                    try {
                        // await axiosInstance.post(endpoints.finance.account, selectedAccount);
                        // Confirm the finance request after saving account
                        await axiosInstance.post(endpoints.finance.confirm);
                        enqueueSnackbar('Request submitted successfully!');
                        setActiveStep((active) => active + 1);
                    }
                    catch (error) {
                        enqueueSnackbar(error.toString(), { variant: 'error' });
                    }
                }
                else {
                    enqueueSnackbar('Please Add Payment Channel First', { variant: 'error' });
                }
            }
            else {
                // call again function to check if correcton required
                if (userFinance?.creditScore.basicInfo.action === 'Correction') {
                    try {
                        // await axiosInstance.post(endpoints.finance.account, selectedAccount);
                        // Confirm the finance request after saving account
                        await axiosInstance.post(endpoints.finance.confirm);
                        enqueueSnackbar('Request submitted successfully!');
                        setActiveStep((active) => active + 1);
                    }
                    catch (error) {
                        enqueueSnackbar(error.toString(), { variant: 'error' });
                    }
                    return;
                }
                // If the user has already applied for finance
                enqueueSnackbar('You have already applied for finance');
            }
        }
        else {
            if (!userFinance?.applied)
                completed.onFalse();
            setActiveStep((active) => active + 1);
        }
    };
    // action is passing to components
    const action = (<Box display="flex" justifyContent="flex-end" sx={{ p: 1.5 }}>
      <Button variant="outlined" type="submit" color="primary" disabled={userFinance?.applied && userFinance?.creditScore.basicInfo.action !== 'Correction'}>
        {t(`${lang.financing}.submit`)}
      </Button>
    </Box>);
    function getStepContent(step) {
        switch (step) {
            case 0:
                return {
                    type: 'UploadCNIC',
                    component: (<UploadCNIC userInfo={userInfo} userFinance={userFinance} setUserInfo={setUserInfo} completed={completed}/>),
                };
            case 1:
                return {
                    type: 'BasicInformation',
                    component: (<BasicInformation action={action} userInfo={userInfo} userFinance={userFinance} setUserInfo={setUserInfo} completed={completed}/>),
                };
            case 2:
                return {
                    type: 'BusinessInformation',
                    component: (<BusinessInformation action={action} completed={completed} userFinance={userFinance}/>),
                };
            case 3:
                return {
                    type: 'EmergencyContact',
                    component: (<EmergencyContact userFinance={userFinance} action={action} completed={completed}/>),
                };
            case 4:
                return {
                // type: 'StepThreePaymentMethod',
                // component: (
                //   <StepThreePaymentMethod setSelectedAccount={setSelectedAccount} completed={completed} />
                // ),
                };
            default:
                return {
                    type: 'Unknown',
                    component: 'Unknown step',
                };
        }
    }
    const stepContent = getStepContent(activeStep);
    return (<div>
      {loading.value && <LoadingSpinner />}
      <Stack sx={{ my: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            return (<Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>);
        })}
        </Stepper>
        <Divider sx={{ my: 2 }}/>
      </Stack>
      <Stack sx={{ my: 2 }}>
        <FinanceStatus status={userFinance?.creditScore?.basicInfo?.status}/>
        <TrustBox />
      </Stack>
      <Stack sx={{ my: 2 }}>
        {activeStep === steps.length ? (<Paper elevation={3} sx={{
                p: 3,
                my: 3,
                minHeight: 150,
                // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                display: 'flex',
                alignItems: 'center', // Vertical alignment
                justifyContent: 'center', // Horizontal alignment
            }}>
            <Typography sx={{ my: 1 }}>{t(`${lang.financing}.profileSubmitted`)}</Typography>
          </Paper>) : (<>
            <Paper elevation={3} sx={{
                p: 3,
                my: 3,
                minHeight: 120,
                // bgcolor: (theme) => alpha(theme.palette.grey[500]),
            }}>
              <Typography sx={{ my: 1 }}> {stepContent.component}</Typography>
            </Paper>
            <Box sx={{ display: 'flex' }}>
              <Button variant="outlined" color="inherit" disabled={activeStep === 0} onClick={async () => {
                await dispatch(getUserFinance(userData.userId));
                completed.onTrue();
                setActiveStep((active) => active - 1);
            }} sx={{ mr: 1 }}>
                {t(`${lang.financing}.back`)}
              </Button>
              <Box sx={{ flexGrow: 1 }}/>

              <Button disabled={!completed.value} variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1
                ? t(`${lang.financing}.submit`)
                : t(`${lang.financing}.next`)}
              </Button>
            </Box>
          </>)}
      </Stack>
    </div>);
}
