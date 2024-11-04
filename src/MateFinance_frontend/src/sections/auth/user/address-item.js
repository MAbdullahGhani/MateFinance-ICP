import PropTypes from 'prop-types'; // @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function AddressItem({ address, action, sx, ...other }) {
  const { accountName, AccountType, accountNumber } = address;

  return (
    <Stack
      component={Paper}
      spacing={2}
      alignItems={{ md: 'flex-end' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">{accountName}</Typography>
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {AccountType}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {accountNumber}
        </Typography>
      </Stack>

      {action}
    </Stack>
  );
}

AddressItem.propTypes = {
  action: PropTypes.node,
  address: PropTypes.object,
  sx: PropTypes.object,
};
