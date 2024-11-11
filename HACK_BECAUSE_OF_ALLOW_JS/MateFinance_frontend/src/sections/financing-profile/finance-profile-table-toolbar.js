import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// components
import Iconify from 'src/components/iconify';
// locales
import { CircularProgress, FormControl, InputLabel, MenuItem, OutlinedInput, Select, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useLocales } from 'src/locales';
import axiosInstance, { endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------
export default function FinanceProfileTableToolbar({ filters, onFilters, filterOptions, countries, }) {
    const [cities, setCities] = useState([]);
    const { t } = useLocales();
    const multiLang = 'boilerplate.components.inputField';
    const handleFilterName = (event) => {
        onFilters('name', event.target.value);
    };
    const handleAdvanceKycFilter = (event) => {
        const { value } = event.target;
        onFilters('advanceKycFilter', value);
    };
    const getCitiesByCountry = async (newValue) => {
        const country = countries.find((x) => x.name === newValue);
        try {
            const responce = await axiosInstance.post(`${endpoints.admin.getAllCityByCountryNames}`, {
                country: country.isoCode,
            });
            setCities(responce);
        }
        catch (error) {
            console.log('🚀 ~ file: subscribers-list.jsx:282 ~ getCitiesByCountry ~ error:', error);
        }
    };
    const handleFilterService = (event) => {
        onFilters('filter', event.target.value);
    };
    const handleFilterStartDate = useCallback((newValue) => {
        onFilters('startDate', newValue);
    }, [onFilters]);
    const handleFilterCountry = useCallback((newValue) => {
        onFilters('city', '');
        onFilters('countryName', newValue.target.value);
        getCitiesByCountry(newValue.target.value);
    }, [onFilters]);
    const handleFilterCity = useCallback((newValue) => {
        onFilters('city', newValue.target.value);
    }, [onFilters]);
    const handleFilterEndDate = useCallback((newValue) => {
        onFilters('endDate', newValue);
    }, [onFilters]);
    return (<Stack spacing={2} alignItems={{ xs: 'flex-end', md: 'center' }} direction={{
            md: 'row',
        }} sx={{
            p: 2.5,
            pr: { xs: 2.5, md: 1 },
        }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 1 }}>
        <FormControl sx={{
            flexShrink: 0,
            width: { xs: 150, md: 250 },
        }}>
          <InputLabel>Filters</InputLabel>

          <Select 
    // multiple
    value={filters?.filter} onChange={handleFilterService} input={<OutlinedInput label="Filters"/>} 
    // renderValue={(selected) => selected.map((value) => value)}
    sx={{ textTransform: 'capitalize' }}>
            {filterOptions?.map((option) => (<MenuItem key={option} value={option}>
                {/* <Checkbox disableRipple size="small" checked={filters.service.includes(option)} /> */}
                {option}
              </MenuItem>))}
          </Select>
        </FormControl>

        {filters.filter === 'Joining Date' && (<>
            <DatePicker label={t(`${multiLang}.startDate`)} value={filters.startDate} format="dd/MM/yyyy" onChange={handleFilterStartDate} slotProps={{ textField: { fullWidth: true } }} sx={{
                maxWidth: { md: 180 },
            }}/>

            <DatePicker label={t(`${multiLang}.endDate`)} value={filters.endDate} format="dd/MM/yyyy" onChange={handleFilterEndDate} slotProps={{ textField: { fullWidth: true } }} sx={{
                maxWidth: { md: 180 },
            }}/>
          </>)}
        {filters.filter !== '' &&
            filters.filter !== 'Joining Date' &&
            filters.filter !== 'Country' &&
            filters.filter !== 'Advance KYC' && (<TextField fullWidth value={filters.name} onChange={handleFilterName} placeholder="Search ... " InputProps={{
                endAdornment: (<InputAdornment position="end">
                    <Iconify icon="eva:search-fill"/>
                  </InputAdornment>),
            }}/>)}

        {filters.filter === 'Advance KYC' && (<TextField select value={filters.advanceKyc} onChange={handleAdvanceKycFilter} variant="outlined" label="Advance KYC" fullWidth={false} sx={{ width: '26%' }}>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Not Applied">Not Applied</MenuItem>
          </TextField>)}

        {filters.filter === 'Country' && (<>
            <TextField name="Country" label="Country" value={filters?.countryName} onChange={handleFilterCountry} fullWidth select>
              <MenuItem disabled value="">
                Choose Country
              </MenuItem>
              {countries.length > 0 ? (countries.map((option, index) => {
                return (<MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>);
            })) : (<CircularProgress size="1rem" style={{ marginLeft: '80px' }}/>)}
            </TextField>
            <TextField name="city" label="City" value={filters?.city} onChange={handleFilterCity} fullWidth select>
              <MenuItem disabled value="">
                Choose City
              </MenuItem>
              {cities?.length > 0
                ? cities?.map((option, index) => {
                    return (<MenuItem key={option.name} value={option.name}>
                        {option.name}
                      </MenuItem>);
                })
                : ''}
            </TextField>
          </>)}
      </Stack>
    </Stack>);
}
FinanceProfileTableToolbar.propTypes = {
    filters: PropTypes.object,
    onFilters: PropTypes.func,
};
