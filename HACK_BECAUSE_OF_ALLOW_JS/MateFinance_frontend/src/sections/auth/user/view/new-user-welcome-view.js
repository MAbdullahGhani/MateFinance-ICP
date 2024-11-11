import { useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// redux
// import { logout } from 'src/redux/slices/auth';
// import { useDispatch } from 'src/redux/store';
// routes
// import { usePathname, useRouter } from 'src/routes/hook';
// assets
// components
// third party
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { PATH_AFTER_LOGIN } from 'src/config-global';
// ----------------------------------------------------------------------
export default function NewUserWelcomeView() {
    // hook
    // const pathname = usePathname();
    const [userInfoData, setUserInfoData] = useState([]);
    // const router = useRouter();
    // actions || store
    // const dispatch = useDispatch();
    const getUserInfo = async () => {
        try {
            const response = await axios.get(endpoints.auth.getUserInfo);
            if (response?.user) {
                setUserInfoData(response?.user);
            }
        }
        catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getUserInfo();
    }, []);
    return (<Stack spacing={2.0}>
      <Typography variant="h3" sx={{ my: 1, color: 'white' }}>
        Verification Email Sent
      </Typography>
      <Typography sx={{ my: 1, color: 'white' }}>Please Verify Your Account</Typography>
      <div>
        <Button variant="soft" color="inherit" onClick={() => {
            // dispatch(logout());
            localStorage.removeItem('register');
            // router.push(PATH_AFTER_LOGIN);
        }} sx={{ color: 'white' }}>
          Continue
        </Button>
      </div>
    </Stack>);
}
