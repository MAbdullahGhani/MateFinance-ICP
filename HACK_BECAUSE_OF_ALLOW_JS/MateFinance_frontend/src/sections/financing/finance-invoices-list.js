import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// _mock
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, emptyRows, getComparator, useTable, } from 'src/components/table';
//
// import UserTableFiltersResult from './table/finance-invoice-table/user-table-filters-result';
import { useLocales } from 'src/locales';
import InvoiceTableRow from '../purchases/table/invoice-table-row';
import { getApInvoices, getArInvoices } from './actions/financing-invoices-api';
// ----------------------------------------------------------------------
const defaultFilters = {
    status: 'ap',
};
// ----------------------------------------------------------------------
const FinanceInvoicesList = () => {
    const multiLang = 'boilerplate.components.Invoices';
    const multiLang3 = 'boilerplate.invoices.Tables.data';
    const { t } = useLocales();
    const STATUS_OPTIONS = [
        { value: 'ap', label: t(`${multiLang3}.purchase`) },
        { value: 'ar', label: t(`${multiLang3}.sales`) },
    ];
    const TABLE_HEAD = [
        { id: 'customer', label: t(`${multiLang3}.head3`) },
        { id: 'invoiceRef', label: t(`${multiLang3}.InvRef`) },
        { id: 'creationDate', label: t(`${multiLang3}.head2`) },
        { id: 'dueDate', label: t(`${multiLang3}.head9`) },
        { id: 'netAmtFC', label: t(`${multiLang3}.head4`) },
        { id: 'status', label: t(`${multiLang3}.head6`) },
        { id: 'paymentConfirmation', label: t(`${multiLang}.invoiceStatus.Acknowledged`) },
        { id: 'actions', label: '' },
    ];
    const table = useTable();
    const settings = useSettingsContext();
    const router = useRouter();
    const confirm = useBoolean();
    const [tableData, setTableData] = useState([]);
    const [tableData2, setTableData2] = useState([]);
    // *Get AP Invoices
    useEffect(() => {
        getApInvoices()
            .then((res) => {
            setTableData(res.isInvoice);
            // console.log('Promise resolved:', res);
        })
            .catch((error) => {
            console.error('Promise rejected:', error);
        });
        getArInvoices()
            .then((res) => {
            setTableData2(res.isInvoice);
        })
            .catch((error) => {
            console.error('Promise rejected:', error);
        });
        // Access the result of  API call
    }, []);
    //* Handle View Invoice
    const handleViewRow = useCallback((id) => {
        router.push(paths.dashboard.sales.details(id));
        // if (filters.status == 'ap') {
        //   router.push(paths.dashboard.purchases.details(id));
        // } else {
        //   router.push(paths.dashboard.sales.details(id));
        // }
    }, [router]);
    const [filters, setFilters] = useState(defaultFilters);
    const dataFiltered = applyFilter({
        ap: tableData,
        ar: tableData2,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });
    const denseHeight = table.dense ? 52 : 72;
    const canReset = !isEqual(defaultFilters, filters);
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
    const handleFilters = useCallback((name, value) => {
        table.onResetPage();
        setFilters((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, [table]);
    const handleFilterStatus = useCallback((event, newValue) => {
        handleFilters('status', newValue);
    }, [handleFilters]);
    return (<>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card>
          <Tabs value={filters.status} onChange={handleFilterStatus} sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}>
            {STATUS_OPTIONS.map((tab) => (<Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} icon={<Label variant={((tab.value === 'ap' || tab.value === filters.status) && 'filled') || 'soft'} color={(tab.value === 'ap' && 'success') ||
                    (tab.value === 'ar' && 'warning') ||
                    'default'}>
                    {tab.value === 'ap' && tableData.length}

                    {tab.value === 'ar' && tableData2.length}
                  </Label>}/>))}
          </Tabs>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} rowCount={dataFiltered.length} numSelected={table.selected.length} onSort={table.onSort}/>

                <TableBody>
                  {dataFiltered
            .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
            .map((row) => (<InvoiceTableRow key={row.id} row={row} onViewRow={() => handleViewRow(row._id)} selected={table.selected.includes(row.id)} onSelectRow={() => table.onSelectRow(row.id)}/>))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}/>

                  <TableNoData notFound={notFound}/>
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom count={dataFiltered.length} page={table.page} rowsPerPage={table.rowsPerPage} onPageChange={table.onChangePage} onRowsPerPageChange={table.onChangeRowsPerPage} 
    //
    dense={table.dense}/>
        </Card>
      </Container>

      <ConfirmDialog open={confirm.value} onClose={confirm.onFalse} title="Delete" content={<>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>} action={<Button variant="contained" color="error" onClick={() => {
                // handleDeleteRows();
                confirm.onFalse();
            }}>
            Delete
          </Button>}/>
    </>);
};
export default FinanceInvoicesList;
// ----------------------------------------------------------------------
function applyFilter({ ap, ar, filters }) {
    const { status } = filters;
    // const stabilizedThis = inputData.map((el, index) => [el, index]);
    // stabilizedThis.sort((a, b) => {
    //   const order = comparator(a[0], b[0]);
    //   if (order !== 0) return order;
    //   return a[1] - b[1];
    // });
    // inputData = stabilizedThis.map((el) => el[0]);
    let inputData = [];
    if (status === 'ap') {
        inputData = ap;
    }
    if (status === 'ar') {
        inputData = ar;
    }
    return inputData;
}
