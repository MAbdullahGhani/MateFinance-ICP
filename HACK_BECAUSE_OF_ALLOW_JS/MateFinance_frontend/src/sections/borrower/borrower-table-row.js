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
import { fCurrency, fNumber, formatCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { HOST_API } from 'src/config-global';
// ----------------------------------------------------------------------
export default function BorrowerTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
    const { _id, additionalDocument, country, email, fullName, requesterName, requestDate, requestBy, invoiceId, principal, currency, lastName, geoLocation, identityDoc, isBoarding, profilePicture, status, chainId, } = row;
    const confirm = useBoolean();
    const collapse = useBoolean();
    const popover = usePopover();
    const renderPrimary = (<TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={requesterName} 
    // src={`${HOST_API}/${profilePicture[0]?.attachmentPath}`}
    sx={{ mr: 2 }}/>

        <ListItemText primary={requesterName || fullName} secondary={email} primaryTypographyProps={{ typography: 'body2' }} secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
        }}/>
      </TableCell>
      <TableCell>{invoiceId}</TableCell>
      <TableCell>{requestBy === 'vendor' ? 'AR' : 'AP'}</TableCell>
      <TableCell>{chainId}</TableCell>
      <TableCell>
        <ListItemText primary={fDate(requestDate)} secondary={fTime(requestDate)} primaryTypographyProps={{ typography: 'body2', noWrap: true }} secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
        }}/>
      </TableCell>
      <TableCell>{`${currency || ''} ${fNumber(principal)}`}</TableCell>
      <TableCell>
        <Label variant="soft" color={(status === 'Active' && 'success') || (status === 'pending' && 'error') || 'info'}>
          {status}
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
    //   <TableRow>
    //     <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
    //       <Collapse
    //         in={collapse.value}
    //         timeout="auto"
    //         unmountOnExit
    //         sx={{ bgcolor: 'background.neutral' }}
    //       >
    //         <Stack component={Paper} sx={{ m: 1.5 }}>
    //           {items.map((item) => (
    //             <Stack
    //               key={item.id}
    //               direction="row"
    //               alignItems="center"
    //               sx={{
    //                 p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
    //                 '&:not(:last-of-type)': {
    //                   borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
    //                 },
    //               }}
    //             >
    //               <Avatar
    //                 src={item.coverUrl}
    //                 variant="rounded"
    //                 sx={{ width: 48, height: 48, mr: 2 }}
    //               />
    //               <ListItemText
    //                 primary={item.name}
    //                 secondary={item.sku}
    //                 primaryTypographyProps={{
    //                   typography: 'body2',
    //                 }}
    //                 secondaryTypographyProps={{
    //                   component: 'span',
    //                   color: 'text.disabled',
    //                   mt: 0.5,
    //                 }}
    //               />
    //               <Box>x{item.quantity}</Box>
    //               <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(item.price)}</Box>
    //             </Stack>
    //           ))}
    //         </Stack>
    //       </Collapse>
    //     </TableCell>
    //   </TableRow>
    // );
    return (<>
      {renderPrimary}

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem onClick={() => {
            onViewRow();
            popover.onClose();
        }}>
          <Iconify icon="solar:eye-bold"/>
          View Detail
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog open={confirm.value} onClose={confirm.onFalse} title="Delete" content="Are you sure want to delete?" action={<Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>}/>
    </>);
}
BorrowerTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onViewRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};
