import { Card, Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Import the day icon
import NightsStayIcon from '@mui/icons-material/NightsStay'; // Import the night icon
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Import the evening icon
import Brightness5Icon from '@mui/icons-material/Brightness5'; // Import the afternoon icon
import { useAuthContext } from 'src/auth/hooks';
const WelcomePage = () => {
    const { user, authenticated } = useAuthContext();
    const [timeOfDay, setTimeOfDay] = useState('day'); // Default to day
    useEffect(() => {
        const currentTime = new Date().getHours();
        if (currentTime >= 6 && currentTime < 12) {
            setTimeOfDay('morning');
        }
        else if (currentTime >= 12 && currentTime < 18) {
            setTimeOfDay('afternoon');
        }
        else if (currentTime >= 18 && currentTime < 20) {
            setTimeOfDay('evening');
        }
        else {
            setTimeOfDay('night');
        }
    }, []);
    const getGreetingMessage = () => {
        switch (timeOfDay) {
            case 'morning':
                return 'Good Morning';
            case 'afternoon':
                return 'Good Afternoon';
            case 'evening':
                return 'Good Evening';
            case 'night':
                return 'Have a Good Night';
            default:
                return 'Hello 🌞'; // Default case
        }
    };
    const getGreetingIcon = () => {
        switch (timeOfDay) {
            case 'morning':
                return <WbSunnyIcon />;
            case 'afternoon':
                return <Brightness5Icon />;
            case 'evening':
                return <Brightness4Icon />;
            case 'night':
                return <NightsStayIcon />;
            default:
                return null; // Default case
        }
    };
    return (<Container maxWidth="xxl">
      <Typography variant="h4" sx={{ textAlign: 'left' }} color="#69357A">
        Welcome
      </Typography>
      <Typography variant="h2" color="#9E2654">
        {user?.firstName + ' ' + user?.lastName}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h4" sx={{
            textAlign: 'left',
            whiteSpace: 'nowrap',
        }} color="#69357A">
          {getGreetingMessage()}
        </Typography>
        {getGreetingIcon()}
      </Stack>
    </Container>);
};
export default WelcomePage;
