import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { Document, Page } from '@react-pdf/renderer';
import { HOST_API } from 'src/config-global';
const Index = ({ open, setOpen, attachment }) => {
    // Extract the content type from the base64 string
    const contentType = attachment?.data?.split(';')[0].split(':')[1];
    // Check if it's a PDF
    const isPDF = contentType === 'application/pdf';
    // Check if it's an image
    const isImage = contentType?.startsWith('image/');
    return (<>
      {open && (<Dialog onClose={() => setOpen(false)} aria-labelledby="simple-dialog-title" open={open} maxWidth="md" fullWidth fullHeight>
          {/* View File Dialog */}
          <DialogTitle id="form-dialog-title">
            {/* File Details */}
            {isPDF ? 'PDF' : 'Image'}
          </DialogTitle>
          <DialogContent>
            {/* // eslint-disable-next-line no-nested-ternary */}
            {isPDF ? (<iframe src={attachment?.data} title="PDF Viewer" width="100%" height="500px"/>) : isImage ? (<img src={attachment?.data} alt="Image"/>) : (<iframe src={`${attachment?.data}`} title="PDF Viewer" width="100%" height="500px"/>)}
          </DialogContent>
          <DialogActions>
            <Button onClick={setOpen} color="primary" variant="outlined">
              {/* Discard */}
              Close
            </Button>
          </DialogActions>
        </Dialog>)}
    </>);
};
export default Index;
