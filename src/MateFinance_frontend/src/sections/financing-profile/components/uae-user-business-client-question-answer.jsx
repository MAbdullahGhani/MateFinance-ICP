import { Card, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

const UAEBusinessClientQuestionAnswer = ({ user }) => {
  return (
    <Card sx={{ width: '100%', padding: '20px' }}>
      <Typography variant="h4" color="secondary">
        Business Client Questions
      </Typography>
      {user?.userFinance?.businessClientQuestionnaireUAE.map((obj, i) => {
        const { answer, question, id, _id } = obj;
        return (
          <Stack px={3} py={1}>
            <Typography variant="h5" fontWeight="bold" sx={{ my: '15px' }}>
              Q{i + 1} : {question}
            </Typography>
            <TextField
              fullWidth
              id="demo-helper-text-misaligned"
              key={id}
              disabled
              InputLabelProps={{
                shrink: true,
                children: (
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {question}
                  </Typography>
                ),
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ variant: 'h6', fontSize: '18px' }}>
                    <b>{answer}</b>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        );
      })}
    </Card>
  );
};

export default UAEBusinessClientQuestionAnswer;
