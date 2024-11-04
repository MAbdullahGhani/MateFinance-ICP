import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';
import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

// ----------------------------------------------------------------------

export default function LenderDetailsToolbar({
  status,
  backLink,
  createdAt,
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();

  const showDialog = useBoolean();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [comments, setComments] = useState('');

  const handleShowModal = (val) => {
    setSelectedStatus(val);
    showDialog.onTrue();
  };

  const handleCloseModal = () => {
    showDialog.onFalse();
    setSelectedStatus('');
    setComments('');
  };

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            {/* <Stack spacing={1} direction="row" alignItems="center">
              <Label
                variant="soft"
                color={
                  (status === 'approve' && 'success') ||
                  (status === 'needMoreDetails' && 'warning') ||
                  (status === 'rejected' && 'error') ||
                  'default'
                }
              >
                {statusOptions.find((x) => x.value === status)?.label || ''}
              </Label>
            </Stack> */}

            {/* <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography> */}
          </Stack>
        </Stack>
        {status !== 'approve' && status !== 'rejected' && (
          <Stack
            flexGrow={1}
            spacing={1.5}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            {statusOptions
              ?.filter((statusOptions) => statusOptions.value !== status && statusOptions.show)
              .map((status) => (
                <Button
                  color={status.color || 'primary'}
                  variant="contained"
                  onClick={() => handleShowModal(status?.value)}
                >
                  {status.label}
                </Button>
              ))}
          </Stack>
        )}
        {/* {status === 'approve' && (
          <Stack
            flexGrow={1}
            spacing={1.5}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button
              color={'secondary'}
              variant="contained"
              // onClick={() => handleShowModal(status?.value)}
            >
              Inactive Lender
            </Button>
          </Stack>
        )} */}
      </Stack>

      {/* DETAILS */}
      <Dialog fullWidth maxWidth="xs" open={showDialog.value} onClose={handleCloseModal}>
        <DialogTitle sx={{ pb: 2 }}>Details</DialogTitle>

        <DialogContent sx={{ typography: 'body2' }}>
          <TextField
            sx={{ mt: 2 }}
            disabled
            fullWidth
            autoFocus
            onChange={(event) => setComments(event.target.value)}
            value={selectedStatus.toUpperCase()}
            name="comments"
            label="Status"
            placeholder=""
            size="small"
            className="customTextField"
          />

          <TextField
            sx={{ mt: 2 }}
            fullWidth
            autoFocus
            onChange={(event) => setComments(event.target.value)}
            value={comments}
            name="comments"
            label="Comments"
            placeholder=""
            size="small"
            className="customTextField"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onChangeStatus(selectedStatus, comments, handleCloseModal)}
          >
            Submit
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

LenderDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  onChangeStatus: PropTypes.func,
  orderNumber: PropTypes.string,
  status: PropTypes.string,
  statusOptions: PropTypes.array,
};
