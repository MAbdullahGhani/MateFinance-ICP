import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { LENDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';

import axios, { endpoints } from 'src/utils/axios';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import LenderDetailsToolbar from '../lander-details-toolbar';
import LenderDetailsItems from '../lander-details-item';
import LenderDetailsHistory from '../lander-details-history';

// import OrderDetailsInfo from '../order-details-info';
// import OrderDetailsItems from '../order-details-item';
// import OrderDetailsHistory from '../order-details-history';

// ----------------------------------------------------------------------

export default function LenderDetailsView({ id }) {
  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [lenderDetails, setLenderDetails] = useState(null);

  useEffect(() => {
    if (id) {
      getLenderDetails();
    }
  }, [id]);

  const getLenderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${endpoints.app.getLenderById}?id=${id}`);
      setLenderDetails(response?.lender[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const handleUpdateStatus = async (status, comments, handleCloseModal) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoints.app.updateStatusLender, {
        id,
        status,
        comments,
      });
      handleCloseModal();
      enqueueSnackbar(response?.lenderStatus);
      getLenderDetails();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  return (
    <>
      {loading && <LoadingScreenCustom />}
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <LenderDetailsToolbar
          backLink={paths.dashboard.lender.root}
          statusOptions={LENDER_STATUS_OPTIONS}
          status={lenderDetails?.status}
          createdAt={lenderDetails?.createdAt || new Date()}
          onChangeStatus={handleUpdateStatus}
        />

        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Stack spacing={3} direction={{ md: 'column' }}>
              {lenderDetails && (
                <LenderDetailsItems
                  status={lenderDetails?.status}
                  statusOptions={LENDER_STATUS_OPTIONS}
                  lender={lenderDetails}
                  getLenderDetails={getLenderDetails}
                />
              )}
            </Stack>
          </Grid>

          {/* <Grid xs={12} md={4}>
            <LenderDetailsHistory history={[]} />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}

LenderDetailsView.propTypes = {
  id: PropTypes.string,
};
