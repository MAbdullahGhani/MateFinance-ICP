import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  TableContainer,
  ListItemAvatar,
  Avatar,
  Card,
} from '@mui/material';
import { TableNoData } from 'src/components/table';
import { Icon } from '@iconify/react';
import EmptyContent from 'src/components/empty-content/empty-content';

const ViewContact = ({ open, onClose, subscriberName, contactList }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Contact List for {subscriberName}</Typography>
      </DialogTitle>
      <DialogContent>
        <div>
          <List>
            {contactList?.length > 0 ? (
              contactList.map((contact, index) => (
                <ListItem key={index} button>
                  <ListItemAvatar>
                    <Avatar>
                      <Icon icon="carbon:user-avatar-filled" />
                    </Avatar>
                  </ListItemAvatar>
                  <Typography variant="body1">{contact.mobile}</Typography>
                </ListItem>
              ))
            ) : (
              <EmptyContent filled title="No Data" />
            )}
          </List>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContact;
