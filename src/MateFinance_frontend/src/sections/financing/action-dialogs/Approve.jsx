import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';

export default function Approve({
  state,
  setState,
  handleFinanceAction,
  handleClose,
  inv,
  loading,
}) {
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      approvedAmount: inv.invoiceFinanceObj.requestAmount,
    }));
  }, [setState, inv]);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    // Remove leading minus sign if present
    const sanitizedValue = inputValue.replace(/^-|[^0-9+-]|--/g, '');
    setState({ ...state, approvedAmount: sanitizedValue });
  };

  function isPositiveInteger(value) {
    return /^[\d.,]+$/.test(value);
  }

  const handleChangeInterest = (e) => {
    const { name, value } = e.target;

    // Check if the entered value is a positive integer and less than or equal to 10
    if (isPositiveInteger(value) || value === '') {
      if (value <= 10 && value >= 0) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
      if (value === '') {
        setState((prevState) => ({
          ...prevState,
          [name]: '',
        }));
      }
    }
  };

  return (
    <div>
      <Dialog open maxWidth="sm" fullWidth>
        <DialogTitle>Actions</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              id="amount"
              name="approvedAmount"
              inputProps={{ min: 0 }}
              margin="normal"
              label="Approved Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={state.approvedAmount}
              onChange={(e) => handleChange(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{inv.currency.code}</InputAdornment>
                ),
              }}
            />
            <TextField
              name="interestRate"
              label="Monthly Finance Rate"
              fullWidth
              type="text" // Use type text instead of number
              value={state.interestRate}
              onChange={handleChangeInterest}
              InputProps={{
                startAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
            />
            <TextField
              margin="normal"
              id="internalComments"
              label="Internal Notes"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={state.internalComments}
              onChange={(e) => setState({ ...state, internalComments: e.target.value })}
            />
            <TextField
              rows={3}
              margin="normal"
              id="externelComments"
              label="Externel Notes"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              value={state.externelComments}
              onChange={(e) => setState({ ...state, externelComments: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={() => handleFinanceAction('Approved', inv)}
            color="primary"
            variant="contained"
            disabled={loading.value}
            loading={loading.value}
          >
            Approve
          </LoadingButton>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
