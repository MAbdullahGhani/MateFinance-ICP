import { Box, Typography } from '@mui/material';
import React from 'react';

export const PostDashboardStateCard = ({ title, number }) => {
  return (
    <Box
      sx={{
        height: 126,
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: 'white',
        boxShadow: '0px 10px 30px rgba(17, 38, 146, 0.05)',
        borderRadius: 2.5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 1.25,
        display: 'flex',
      }}
    >
      <Box
        sx={{
          width: 68,
          height: 68,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: 68,
            height: 68,
            position: 'absolute',
            borderRadius: '50%',
            border: '2px solid #E9ECEF',
          }}
        >
          <Box
            sx={{
              width: 68,
              height: 68,
              position: 'absolute',
              border: '4px solid #9E2654',
              borderRadius: '50%',
            }}
          />
        </Box>
        <Box
          component="img"
          sx={{
            width: 35,
            height: 40,
            position: 'absolute',
            left: 17,
            top: 14,
          }}
          src="/logo/mate.finance_verti.png"
        />
      </Box>
      <Box
        sx={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 1,
          display: 'flex',
        }}
      >
        <Typography
          sx={{
            color: '#8A92A6',
            wordWrap: 'break-word',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: '#232D42',
            fontSize: 32,
            textWrap: 'nowrap',
            fontWeight: '700',
            wordWrap: 'break-word',
          }}
        >
          {number}
        </Typography>
      </Box>
    </Box>
  );
};
