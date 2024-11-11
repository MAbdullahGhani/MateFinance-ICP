import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
export default function Reject({ state, setState, handleFinanceAction, handleClose, inv, loading, }) {
    return (<Dialog open maxWidth="sm" fullWidth>
      <DialogTitle>Actions</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField autoFocus margin="normal" id="internalComments" label="Internal Notes" type="text" fullWidth variant="outlined" multiline rows={3} value={state.internalComments} onChange={(e) => setState({ ...state, internalComments: e.target.value })}/>
          <TextField rows={3} margin="normal" id="externelComments" label="External Notes" type="text" fullWidth variant="outlined" multiline value={state.externelComments} onChange={(e) => setState({ ...state, externelComments: e.target.value })}/>
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={() => handleFinanceAction('Rejected', inv)} color="primary" variant="contained" disabled={loading.value} loading={loading.value}>
          Reject
        </LoadingButton>
        <Button onClick={handleClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>);
}
