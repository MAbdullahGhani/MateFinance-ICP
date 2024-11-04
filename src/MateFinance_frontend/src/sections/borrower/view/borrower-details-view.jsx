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
// import LenderDetailsToolbar from '../lander-details-toolbar';
// import LenderDetailsItems from '../lander-details-item';

// import OrderDetailsInfo from '../order-details-info';
// import OrderDetailsItems from '../order-details-item';
// import OrderDetailsHistory from '../order-details-history';

// ----------------------------------------------------------------------

export default function BorrowerDetailsView({ id }) {
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

  return <>{loading && <LoadingScreenCustom />}</>;
}

BorrowerDetailsView.propTypes = {
  id: PropTypes.string,
};
