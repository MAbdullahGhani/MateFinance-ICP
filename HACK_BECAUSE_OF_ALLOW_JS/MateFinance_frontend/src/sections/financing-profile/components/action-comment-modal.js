import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, MenuItem, } from '@mui/material';
const ActionCommentModal = ({ open, onClose, userDetail, openApproveModal, openRejectModal, openCorrectionRequiredModal, handleChangeNote, formState, selectedCreditScore, customScore, setCustomScore, orgTypelist, orgType, setOrgType, creditScoreCriteriaList, lendingPartnerList, lendingPartner, setLendingPartner, }) => {
    console.log(selectedCreditScore?.name);
    return (<Box>
      <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <h3>{selectedCreditScore?.name}</h3>
        </DialogTitle>

        <DialogContent>
          {selectedCreditScore?.name === creditScoreCriteriaList.basicInfo?.name ? (<>
              <TextField select fullWidth value={orgType.organizationType} label="Organization Type" onChange={(e) => {
                const { value } = e.target;
                setOrgType({
                    organizationType: value,
                    organizationTypeId: orgTypelist.find((item) => item.organizationType === value)
                        ._id,
                });
            }} margin="normal" variant="outlined">
                {orgTypelist.map((option) => (<MenuItem key={option.organizationType} value={option.organizationType}>
                    {`${option.organizationType}`}
                  </MenuItem>))}
              </TextField>
              <TextField select fullWidth error={!!formState?.errors?.lendingPartner} helperText={formState?.errors?.lendingPartner} value={lendingPartner?.bankName} label="Lending Partner" placeholder="Lending Partner" onChange={(e) => {
                const { value } = e.target;
                const bank = lendingPartnerList.find((item) => item.bankName === value);
                if (bank) {
                    setLendingPartner(bank.bankName); // Update state
                }
                else {
                    setLendingPartner(''); // Reset state if bank not found
                }
            }} margin="normal" variant="outlined">
                {lendingPartnerList
                ?.filter((option) => option.status === 'Active') // Filter banks with status Active
                .map((option) => (<MenuItem key={option.bankName} value={option.bankName}>
                      {`${option.bankName}`}
                    </MenuItem>))}
              </TextField>
            </>) : ('')}
          <TextField error={!!formState.errors.score} helperText={formState.errors.score} name="Score" label="Score" value={customScore} fullWidth InputProps={{
            inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*[.]?[0-9]*',
                maxLength: 10, // Add this line to limit the input to 10 digits
            },
        }} onChange={(event) => {
            const newValue = event.target.value;
            if (/^\d*\.?\d*$/.test(newValue) || newValue === '') {
                // Limit the length to 10 digits
                const limitedValue = newValue.slice(0, 10);
                setCustomScore(limitedValue);
            }
        }} margin="normal" variant="outlined"/>

          <TextField error={!!formState.errors.note} helperText={formState.errors.note} name="note" label="Note" value={formState.note} fullWidth multiline rows={4} onChange={handleChangeNote} margin="normal" variant="outlined"/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={openApproveModal}>
            Approve
          </Button>
          <Button variant="contained" color="secondary" onClick={openRejectModal}>
            Reject
          </Button>
          <Button variant="contained" onClick={openCorrectionRequiredModal}>
            Need More Detail
          </Button>
          <Button variant="contained" color="inherit" onClick={() => onClose()}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>);
};
export default ActionCommentModal;
