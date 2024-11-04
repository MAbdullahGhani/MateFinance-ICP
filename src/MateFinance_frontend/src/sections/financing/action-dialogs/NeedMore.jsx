import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function NeedMore({
  state,
  setState,
  handleFinanceAction,
  handleClose,
  inv,
  loading,
}) {
  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogTitle>Actions</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            autoFocus
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
            label="External Notes"
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
          onClick={() => handleFinanceAction('Correction Required', inv)}
          color="primary"
          variant="contained"
          disabled={loading.value}
          loading={loading.value}
        >
          Need More Detail
        </LoadingButton>
        <Button onClick={handleClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
