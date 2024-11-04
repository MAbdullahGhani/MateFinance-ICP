import { useEffect, useState } from 'react';

// @mui

// routes

// utils
import axios, { endpoints } from 'src/utils/axios';

//
import NewUserInfoStepper from '../new-user-info-stepper';

// ----------------------------------------------------------------------

export default function NewUserInfoView() {
  // hook
  const [userInfoData, setUserInfoData] = useState([]);

  const getUserInfo = async () => {
    try {
      const response = await axios.get(endpoints.auth.getUserInfo);
      if (response?.user) {
        setUserInfoData(response?.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <NewUserInfoStepper userInfoData={userInfoData} getUserInfo={getUserInfo} />;
}
