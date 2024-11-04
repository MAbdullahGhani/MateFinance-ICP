import React from 'react';
import {
  Typography,
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify/iconify';

function UserPostDatedCheque({ financialDetail, openCommentModalHandler, handleShowFilerDetail }) {
  return (
    <Card sx={{ p: 3, marginTop: 3 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            color="secondary"
            component="h3"
            sx={{ fontWeight: 750, textAlign: 'left', width: 'fit-content' }}
          >
            Post Dated Cheque
          </Typography>
          {/* {financialDetail.creditScore.postDatedCheque?.status !== 'Pending' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => openCommentModalHandler(financialDetail.creditScore.postDatedCheque)}
            >
              Actions
            </Button>
          )} */}
        </div>
        {financialDetail.creditScore.postDatedCheque?.status && (
          <Typography
            variant="h6"
            color="primary"
            component="h3"
            sx={{ fontWeight: 600, textAlign: 'left', fontSize: '16px' }}
          >
            Status: {financialDetail.creditScore.postDatedCheque.status}
          </Typography>
        )}

        <Grid container sx={{ marginTop: 3 }} justifyContent="space-between">
          <Grid item sm={12} md={6} lg={6}>
            <Card
              sx={{
                margin: '30px 10px 10px 10px',
                boxShadow: '5px 5px 5px 10px #eef0e9',
                '& .MuiCardHeader-root': {
                  textAlign: 'left',
                  width: 'fit-content',
                  fontSize: '17px',
                  fontWeight: 600,
                  '&:hover': {
                    cursor: 'pointer',
                  },
                },
                '& .MuiCardContent-root': {
                  padding: '6px',
                  float: 'right',
                },
              }}
            >
              <CardHeader
                title={
                  <Typography
                    onClick={() =>
                      handleShowFilerDetail(financialDetail.postDatedChequeDetial || '')
                    }
                  >
                    {financialDetail.postDatedChequeDetial
                      ? 'View Dated Cheque'
                      : 'Dated Cheque not found'}
                  </Typography>
                }
                subheader=""
              />
              <CardContent>
                {financialDetail.postDatedChequeDetial && (
                  <IconButton
                    onClick={() =>
                      handleShowFilerDetail(financialDetail.postDatedChequeDetial || '')
                    }
                  >
                    <Iconify
                      icon="material-symbols:visibility"
                      color="secondary"
                      fontSize="small"
                    />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
export default UserPostDatedCheque;
