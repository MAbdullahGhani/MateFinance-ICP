import { useEffect, useState } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';

// routes

import { paths } from 'src/routes/paths';
import { useParams } from 'react-router-dom';

// assets
// components

// third party

// utils
import axios from 'axios';

//
import { HOST_API, PATH_AFTER_LOGIN } from 'src/config-global';
import { usePathname, useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function NewUserVerifiedView() {
  // hook
  const pathname = usePathname();
  const IdPath = useParams();
  const [userInfoData, setUserInfoData] = useState([]);
  const router = useRouter();

  const getUserVerified = async () => {
    debugger;
    try {
      const response = await axios.get(`${HOST_API}/lender/verify/${IdPath.id}`);

      console.log(response);
      // if (response?.user) {
      //   setUserInfoData(response?.user);
      // }

      console.log(pathname);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(IdPath);
    getUserVerified();
  }, []);

  return (
    <Stack spacing={2.0}>
      <Typography variant="h3" sx={{ color: 'white' }}>
        Email Verified
      </Typography>
      <Typography sx={{ my: 1, color: 'white' }}>Login to Continue</Typography>
      <div>
        <Button
          variant="soft"
          color="inherit"
          onClick={() => router.push(paths.auth.jwt.login)}
          sx={{ color: 'white' }}
        >
          Click Me
        </Button>
      </div>
    </Stack>
  );
}
