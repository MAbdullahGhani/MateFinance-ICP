import React from 'react';
import { Box, Typography } from '@mui/material';
import Marquee from 'react-fast-marquee';
const BackersComponent = () => {
    const backers = [
        '/assets/background/backers/1.png',
        '/assets/background/backers/2.png',
        '/assets/background/backers/3.png',
        '/assets/background/backers/4.png',
        '/assets/background/backers/6.png',
        '/assets/background/backers/7.png',
        '/assets/background/backers/8.png',
        '/assets/background/backers/9.png',
        '/assets/background/backers/10.png',
        '/assets/background/backers/11.png',
    ];
    return (<Box sx={{
            width: '100%',
            my: 4,
            pt: 4,
            pb: 4,
            background: 'white',
            borderRadius: 3,
            border: '1px solid #E9ECEF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        }}>
      <Typography variant="h4" sx={{
            color: '#667085',
            fontWeight: 600,
            mb: 2,
        }}>
        OUR BACKERS
      </Typography>
      <Marquee>
        {backers.map((backer, index) => (<img key={index} src={backer} alt={`Backer ${index + 1}`} style={{ maxWidth: 150, marginRight: 20 }}/>))}
      </Marquee>
    </Box>);
};
export default BackersComponent;
