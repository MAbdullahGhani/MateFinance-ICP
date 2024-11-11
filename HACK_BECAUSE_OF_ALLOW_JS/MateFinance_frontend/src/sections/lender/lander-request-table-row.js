import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';
import { fCurrency, formatCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ATTACHMENT_TOKEN, ATTACHMENT_URL } from 'src/config-global';
// ----------------------------------------------------------------------
export default function LenderRequestTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow, }) {
    const { dealData, dealId, lenderData, createdAt, lendingAmount, walletAddress, status } = row;
    const confirm = useBoolean();
    const collapse = useBoolean();
    const popover = usePopover();
    const renderPrimary = (<TableRow hover selected={selected}>
      <TableCell>
        {/* <Avatar
          alt={lenderData?.firstName}
          src={
            lenderData?.profilePicture[0]?.attachmentPath
              ? ATTACHMENT_URL + lenderData?.profilePicture[0]?.attachmentPath + ATTACHMENT_TOKEN
              : ''
          }
          sx={{ mr: 2 }}
        /> */}

        <ListItemText primary={lenderData?.firstName + lenderData?.lastName || ''} secondary={lenderData?.email} primaryTypographyProps={{ typography: 'body2' }} secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
        }}/>
      </TableCell>

      <TableCell>
        {/* <Avatar
          alt={dealData?.borrower?.name}
          src={
            dealData?.borrower?.logo[0]?.attachmentPath
              ? ATTACHMENT_URL + dealData?.borrower?.logo[0]?.attachmentPath + ATTACHMENT_TOKEN
              : ''
          }
          sx={{ mr: 2 }}
        /> */}

        <ListItemText primary={dealData?.borrower?.name} secondary={dealData?.borrower?.email} primaryTypographyProps={{ typography: 'body2' }} secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
        }}/>
      </TableCell>

      <TableCell>
        <ListItemText primary={fDate(createdAt)} secondary={fTime(createdAt)} primaryTypographyProps={{ typography: 'body2', noWrap: true }} secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
        }}/>
      </TableCell>

      <TableCell> {formatCurrency(lendingAmount)} </TableCell>

      <TableCell>
        <Label variant="soft" color={'primary'}>
          {dealData?.status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill"/>
        </IconButton>
      </TableCell>
    </TableRow>);
    return (<>
      {renderPrimary}

      {/* {renderSecondary} */}

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

        <MenuItem onClick={() => {
            onViewRow();
            popover.onClose();
        }}>
          <Iconify icon="solar:eye-bold"/>
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog open={confirm.value} onClose={confirm.onFalse} title="Delete" content="Are you sure want to delete?" action={<Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>}/>
    </>);
}
LenderRequestTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onViewRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};
