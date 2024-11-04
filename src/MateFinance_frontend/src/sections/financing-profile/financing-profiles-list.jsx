/* eslint-disable no-shadow */
import {
  Avatar,
  Box,
  Card,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  getComparator,
  useTable,
} from 'src/components/table';
import axiosInstance, { endpoints } from 'src/utils/axios';
import ViewContact from './components/contact-list';
import SubscribersKpi from './components/subscribers-kpi';
import FinanceProfileTableFiltersResult from './finance-profile-table-filter-result';
import FinanceProfileTableToolbar from './finance-profile-table-toolbar';
import useFinanceProfile from './hooks/useFinanceProfile';

const FinancingProfileList = ({ setFormState, selected }) => {
  const [subscribersKpiData, setSubscribersKpiData] = useState({
    Today: '',
    Yesterday: '',
    thisWeek: '',
    thisMonth: '',
    total: '',
  });
  const navigate = useNavigate();
  const [kpiType, setKpiType] = useState('total');

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('joiningDate');
  const [showSubscriberContactModal, setShowSubscriberContactModal] = useState(false);
  const [currentContactList, setCurrentContactList] = useState([]);
  const [currentSubscriberNameContactModal, setCurrentSubscriberNameContactModal] = useState('');
  const [countries, setCountries] = useState([]);
  const { tableData, isLoading, error, setTableData, revalidate, isValidating } =
    useFinanceProfile(kpiType);
  console.log('🚀 ~ FinancingProfileList ~ tableData:', tableData);
  const date = new Date();
  const defaultFilters = {
    name: '',
    filter: '',
    countryName: '',
    city: '',
    startDate: date.setDate(date.getDate() - 7),
    endDate: new Date(),
    advanceKycFilter: ' ',
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const filtersSelect = [
    'Name',
    'Email',
    'Mobile Number',
    'Country',
    'Joining Date',
    'Advance KYC',
  ];
  const getcounteries = async () => {
    try {
      const responce = await axiosInstance.get(`${endpoints.admin.getAllCountryNames}`);
      setCountries(responce);
    } catch (eroor) {
      console.log('🚀 ~ file: subscribers-list.jsx:262 ~ getcounteries ~ eroor:', eroor);
    }
  };

  const handleContactListOpen = async (mobileNumber, subscriberName) => {
    try {
      const response = await axiosInstance.post(endpoints.admin.getMobileUser, {
        mobileNumber,
      });

      const currentContactListTemp = response && response.mobileUser ? response.mobileUser : [];
      console.log('currentContactListTemp: ', currentContactListTemp);
      setCurrentContactList(currentContactListTemp);
      console.log('subscriberName: ', subscriberName);
      setCurrentSubscriberNameContactModal(subscriberName);
      setShowSubscriberContactModal(true);
    } catch (error) {
      console.error('Error loading contact list:', error);
    }
  };

  const handleContactListClose = () => {
    setShowSubscriberContactModal(false);
    setCurrentContactList([]);
  };
  const table = useTable({ defaultOrderBy: 'joiningDate', defaultOrder: 'desc' });
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtering based on Advance KYC status
  const dataFiltered = applyFilter({
    inputData: tableData || [],
    comparator: getComparator(table.order, table.orderBy),
    filters, // Include Advance KYC filter in the filters
  });

  if (orderBy && order) {
    dataFiltered?.sort(getComparator(order, orderBy));
  }

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(endpoints.admin.financeKpi);
      setSubscribersKpiData(response);
      // getFinanceResults();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching finance KPI data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getcounteries();
  }, []);

  useEffect(() => {
    getData();
    revalidate();
  }, [kpiType]);

  const handleKpiClick = (value) => {
    setKpiType(value);
  };

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const daysCalculator = (date_1, date_2) => {
    const date1 = new Date(date_1);
    const difference = date_2.getTime() - date1.getTime();
    const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return totalDays;
  };

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const canReset = !!filters.name || !!filters.filter;

  return (
    <Container maxWidth="xxl">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SubscribersKpi
          subscribersKpiData={subscribersKpiData}
          handleKpiClick={handleKpiClick}
          currentKpiType={kpiType}
        />
      </div>
      <Paper>
        <Card sx={{ mt: 4 }}>
          <Box sx={{ margin: '9px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} sx={{ m: -2 }}>
                <FinanceProfileTableToolbar
                  filters={filters}
                  onFilters={handleFilters}
                  revalidate={revalidate}
                  filterOptions={filtersSelect}
                  countries={countries}
                />
              </Grid>

              {canReset && (
                <Grid item xs={12} md={12} sx={{}}>
                  <FinanceProfileTableFiltersResult
                    filters={filters}
                    onFilters={handleFilters}
                    //
                    onResetFilters={handleResetFilters}
                    //
                    results={dataFiltered.length}
                    sx={{ p: 2.5, pt: 0 }}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
          <TableContainer>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleRequestSort('name')}>Name</TableCell>
                    <TableCell> Email / Mobile#</TableCell>
                    <TableCell onClick={() => handleRequestSort('joiningDate')}>
                      Joining Date
                    </TableCell>

                    <TableCell onClick={() => handleRequestSort('invoiceCount')}>
                      Invoices
                    </TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell onClick={() => handleRequestSort('lastInvoice')}>
                      Last Invoice Created
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* {isLoading ? <LoadingSpinner /> : ''}
                  {loading ? <LoadingSpinner /> : ''} */}
                  {isLoading && (
                    <>
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                    </>
                  )}

                  {/* Render table rows when there is data */}
                  {!isLoading &&
                    dataFiltered.length > 0 &&
                    dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((subscriber) => (
                        <TableRow key={subscriber._id} hover selected={selected}>
                          <TableCell>
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar alt={subscriber.firstName}>
                                {subscriber?.firstName?.charAt(0).toUpperCase()}
                              </Avatar>
                              <span style={{ marginLeft: '8px' }}>{subscriber.fullName}</span>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography>{subscriber?.email}</Typography>
                            <Typography>{subscriber?.mobileNumber}</Typography>
                          </TableCell>
                          <TableCell>
                            {`${moment(subscriber.joiningDate).format(
                              'DD-MM-YYYY'
                            )} (${daysCalculator(subscriber.joiningDate, new Date())} ${
                              daysCalculator(subscriber.joiningDate, new Date()) === 1
                                ? 'day'
                                : 'days'
                            })`}
                          </TableCell>
                          <TableCell>{subscriber.invoiceCount}</TableCell>
                          <TableCell>
                            {subscriber.geoLocation && subscriber.geoLocation.city
                              ? subscriber.geoLocation.city
                              : ''}
                          </TableCell>
                          <TableCell>
                            {subscriber.lastInvoice
                              ? moment(subscriber.lastInvoice).format('DD-MM-YYYY')
                              : ''}
                          </TableCell>
                          <TableCell>
                            <Box style={{ display: 'flex' }}>
                              <IconButton
                                size="small"
                                color="primary"
                                title="Financial Detail"
                                onClick={() =>
                                  navigate(
                                    `/admin/financing/financing-profile/finance-details/${subscriber._id}`
                                  )
                                }
                              >
                                <Iconify icon="ic:baseline-business-center" fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="primary"
                                title="View Invoices"
                                onClick={() =>
                                  navigate(`/admin/subscribers/invoices_detail/${subscriber?._id}`)
                                }
                              >
                                <Iconify icon="fluent:receipt-24-filled" fontSize="small" />
                              </IconButton>
                              <IconButton
                                color="primary"
                                title="View Contacts"
                                onClick={() =>
                                  handleContactListOpen(
                                    subscriber.mobileNumber,
                                    `${subscriber.firstName} ${subscriber.lastName}`
                                  )
                                }
                              >
                                <Iconify icon="ic:sharp-phone" fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}

                  {/* Hide the 'No Data' message when there is data */}
                  {!isLoading && dataFiltered.length === 0 && <TableNoData notFound />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <Box sx={{ position: 'relative' }}>
            <div>
              <TablePaginationCustom
                count={dataFiltered?.length}
                page={table.page}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                //
                dense={table.dense}
                onChangeDense={table.onChangeDense}
              />
            </div>
          </Box>
        </Card>

        <ViewContact
          open={showSubscriberContactModal}
          onClose={handleContactListClose}
          subscriberName={currentSubscriberNameContactModal}
          contactList={currentContactList} // Make sure you pass the contact list here
        />
      </Paper>
    </Container>
  );
};

export default FinancingProfileList;

function applyFilter({ inputData, comparator, filters }) {
  const { filter, name, startDate, endDate, countryName, city, advanceKycFilter } = filters;

  const fields = {
    Name: 'fullName',
    Email: 'email',
    'Mobile Number': 'mobileNumber',
    'Joining Date': 'joiningDate',
    'Invoice Count': 'invoiceCount',
    Country: 'geoLocation.countryName',
    'Advance KYC': 'userFinance.advanceKyc',
  };

  const filterField = fields[filter];

  if (filter && inputData) {
    inputData = inputData.filter((user) => {
      if (filterField === 'joiningDate') {
        const userDate = new Date(user[filterField]);
        const startdate = new Date(startDate);
        const enddate = new Date(endDate);
        return userDate >= startdate && userDate <= enddate;
      }

      if (city) {
        const fieldValue = user?.geoLocation?.city;
        return fieldValue && fieldValue.toLowerCase().includes(city.toLowerCase());
      }

      if (filterField === 'geoLocation.countryName') {
        const fieldValue = user.geoLocation?.countryName;
        return fieldValue && fieldValue.toLowerCase().includes(countryName.toLowerCase());
      }

      if (filterField === 'userFinance.advanceKyc') {
        if (advanceKycFilter === 'Applied') {
          return user.userFinance.advanceKyc.length > 0;
        }
        if (advanceKycFilter === 'Not Applied') {
          return user.userFinance.advanceKyc.length === 0;
        }
        // If 'advanceKycFilter' is not 'Applied' or 'Not Applied', return true for all
        return true;
      }

      const isNested = filterField.includes('.');
      const fieldValue = isNested
        ? filterField.split('.').reduce((obj, key) => obj?.[key], user)
        : user[filterField];

      return fieldValue && fieldValue.toString().toLowerCase().includes(name.toLowerCase());
    });
  }

  return inputData;
}
