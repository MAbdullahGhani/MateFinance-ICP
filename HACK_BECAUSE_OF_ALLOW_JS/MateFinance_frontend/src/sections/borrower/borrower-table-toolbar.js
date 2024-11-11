import PropTypes from 'prop-types';
import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// ----------------------------------------------------------------------
export default function BorrowerTableToolbar({ filters, onFilters, dateError }) {
    const popover = usePopover();
    const handleFilterName = useCallback((event) => {
        onFilters('name', event.target.value);
    }, [onFilters]);
    const handleFilterStartDate = useCallback((newValue) => {
        onFilters('startDate', newValue);
    }, [onFilters]);
    const handleFilterEndDate = useCallback((newValue) => {
        onFilters('endDate', newValue);
    }, [onFilters]);
    return (<>
      <TextField fullWidth value={filters.name} onChange={handleFilterName} placeholder="Search Borrower..." sx={{
            mt: -8,
            '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '20px',
            },
        }} InputProps={{
            startAdornment: (<InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }}/>
            </InputAdornment>),
        }}/>
      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem onClick={() => {
            popover.onClose();
        }}>
          <Iconify icon="solar:printer-minimalistic-bold"/>
          Print
        </MenuItem>

        <MenuItem onClick={() => {
            popover.onClose();
        }}>
          <Iconify icon="solar:import-bold"/>
          Import
        </MenuItem>

        <MenuItem onClick={() => {
            popover.onClose();
        }}>
          <Iconify icon="solar:export-bold"/>
          Export
        </MenuItem>
      </CustomPopover>
    </>);
}
BorrowerTableToolbar.propTypes = {
    dateError: PropTypes.bool,
    filters: PropTypes.object,
    onFilters: PropTypes.func,
};
