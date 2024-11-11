import React, { useCallback, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import DatePick from '../DatePick';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
export default function Disburse({ state, setState, handleFinanceAction, handleClose, inv, loading, }) {
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            disbursedAmount: inv.invoiceFinanceObj.approvedAmount,
        }));
    }, [setState, inv]);
    const handleChange = (event) => {
        const inputValue = event.target.value;
        // Remove leading minus sign if present
        const sanitizedValue = inputValue.replace(/^-|[^0-9+-]|--/g, '');
        setState({ ...state, disbursedAmount: sanitizedValue });
    };
    const handleDateChange = useCallback((newValue) => {
        setState((prev) => ({ ...prev, repaymentDate: newValue }));
    }, [setState]);
    return (<Dialog open maxWidth="sm" fullWidth>
      <DialogTitle>Actions</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Stack>
            <TextField id="amount" inputProps={{ min: 0 }} name="disbursedAmount" margin="normal" label="Disbursed Amount" type="number" fullWidth variant="outlined" value={state.disbursedAmount} onChange={(e) => handleChange(e)} InputProps={{
            startAdornment: (<InputAdornment position="start">{inv.currency.code}</InputAdornment>),
        }}/>
          </Stack>
          <Stack>
            <DatePicker label="Repayment Date" value={state.repaymentDate} onChange={handleDateChange} slotProps={{ textField: { fullWidth: true } }}/>
          </Stack>

          <TextField autoFocus margin="normal" id="internalComments" label="Internal Notes" type="text" fullWidth variant="outlined" multiline rows={3} value={state.internalComments} onChange={(e) => setState({ ...state, internalComments: e.target.value })}/>
          <TextField autoFocus rows={3} margin="normal" id="externalComments" label="External Notes" type="text" fullWidth variant="outlined" multiline value={state.externalComments} onChange={(e) => setState({ ...state, externalComments: e.target.value })}/>
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton disabled={loading.value} loading={loading.value} onClick={() => handleFinanceAction('Disbursed', inv)} color="primary" variant="contained">
          Disbursed
        </LoadingButton>
        <Button onClick={handleClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>);
}
