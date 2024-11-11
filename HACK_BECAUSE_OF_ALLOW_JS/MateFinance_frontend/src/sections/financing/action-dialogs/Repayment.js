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
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
export default function Repayment({ state, setState, handleFinanceAction, handleClose, inv, loading, }) {
    const handleChange = (event) => {
        const inputValue = event.target.value;
        // Remove leading minus sign if present
        const sanitizedValue = inputValue.replace(/^-|[^0-9+-]|--/g, '');
        setState({ ...state, repaymentAmount: sanitizedValue });
    };
    const handleChangeCost = (event) => {
        const inputValue = event.target.value;
        // Remove leading minus sign if present
        const sanitizedValue = inputValue.replace(/^-|[^0-9+-]|--/g, '');
        setState({ ...state, financeCost: sanitizedValue });
    };
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            repaymentAmount: inv.invoiceFinanceObj.disbursedAmount,
        }));
    }, []);
    const handleDateChange = useCallback((newValue) => {
        setState((prev) => ({ ...prev, repaymentDate: newValue }));
    }, [setState]);
    return (<Dialog open maxWidth="sm" fullWidth>
      <DialogTitle>Actions</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField id="rePaymentAmount" inputProps={{ min: 0 }} name="repaymentAmount" margin="normal" label="Repayment Amount" type="number" fullWidth variant="outlined" value={state.repaymentAmount} onChange={(e) => handleChange(e)} InputProps={{
            startAdornment: <InputAdornment position="start">{inv.currency.code}</InputAdornment>,
        }}/>

          <TextField id="financeCost" inputProps={{ min: 0 }} name="financeCost" margin="normal" label="Finance Cost" type="number" fullWidth variant="outlined" value={state.financeCost} onChange={(e) => handleChangeCost(e)} InputProps={{
            startAdornment: <InputAdornment position="start">{inv.currency.code}</InputAdornment>,
        }}/>

          <DatePicker label="Repayment Date" value={state.repaymentDate} onChange={handleDateChange} slotProps={{ textField: { fullWidth: true } }}/>

          <TextField autoFocus margin="normal" id="internalComments" label="Internal Notes" type="text" fullWidth variant="outlined" multiline rows={3} value={state.internalComments} onChange={(e) => setState({ ...state, internalComments: e.target.value })}/>
          <TextField rows={3} margin="normal" id="externalComments" label="External Notes" type="text" fullWidth variant="outlined" multiline value={state.externalComments} onChange={(e) => setState({ ...state, externalComments: e.target.value })}/>
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={() => handleFinanceAction('Repayment', inv)} color="primary" variant="contained" disabled={loading.value} loading={loading.value}>
          Repayment
        </LoadingButton>
        <Button onClick={handleClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>);
}
