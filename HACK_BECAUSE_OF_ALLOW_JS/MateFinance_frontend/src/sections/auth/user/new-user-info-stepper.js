/* eslint-disable no-unused-vars */
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
//
import StepOneUserInfoForm from './step-one-user-info-form';
const NewUserInfoStepper = (props) => {
    // ----------------------------------------------------------------------
    const steps = [];
    // ----------------------------------------------------------------------
    // props
    const { userInfoData, getUserInfo } = props;
    // hooks
    const router = useRouter();
    // state
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState();
    // actions || store
    const isStepSkipped = (step) => skipped?.has(step);
    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        if (activeStep === steps.length - 1) {
            console.log('finish');
            localStorage.setItem('register', 'welcome');
            router.push(paths.auth.user.newUserWelcome);
        }
        else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        setSkipped(newSkipped);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const renderComponent = (<>
      {/* {activeStep === 0 ? ( */}
      <StepOneUserInfoForm userInfoData={userInfoData} getUserInfo={getUserInfo} router={router}/>
      {/* ) : (
          ''
        )} */}
    </>);
    return (<Stack>
      <Typography variant="h6">Onboarding</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
                stepProps.completed = false;
            }
            return (<Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>);
        })}
      </Stepper>
      <Paper sx={{
            p: 1,
            minHeight: 120,
        }}>
        {renderComponent}
      </Paper>
    </Stack>);
};
export default NewUserInfoStepper;
