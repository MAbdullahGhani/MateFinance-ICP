import { useEffect, useState } from 'react';
// @mui
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// components
import { Icon } from '@iconify/react';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label/label';
import Scrollbar from 'src/components/scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, emptyRows, getComparator, useTable, } from 'src/components/table';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import { fDateTime } from 'src/utils/format-time';
import { Divider } from '@mui/material';
// ----------------------------------------------------------------------
const LogsTable = ({ logs }) => {
    console.log('🚀 ~ LogsTable ~ logs:', logs);
    // ----------------------------------------------------------------------
    const { t } = useLocales();
    const TABLE_HEAD = [
        { id: 'Date', label: t(`${lang.finReq}.date`), align: 'left' },
        { id: 'UserName', label: t(`${lang.finReq}.username`), align: 'center' },
        { id: 'Internel', label: 'Internel', align: 'center' },
        { id: 'Externel', label: 'Externel', align: 'center' },
        { id: 'Action', label: t(`${lang.finReq}.action`), align: 'center' },
    ];
    const table = useTable({
        defaultOrderBy: '',
    });
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        setTableData(logs);
    }, [logs]);
    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
    });
    const denseHeight = table.dense ? 34 : 54;
    return (<div>
      <Scrollbar>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction dense={table.dense} numSelected={table.selected.length} rowCount={tableData.length} onSelectAllRows={(checked) => table.onSelectAllRows(checked, tableData.map((row) => row.name))} action={<Tooltip title="Delete">
                <IconButton color="primary">
                  <Iconify icon="solar:trash-bin-trash-bold"/>
                </IconButton>
              </Tooltip>}/>

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} rowCount={tableData.length} numSelected={table.selected.length}/>
              <TableNoData notFound={dataFiltered.length === 0}/>
              <TableBody>
                {dataFiltered
            .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
            .map((row) => {
            const { requestBodyObj, actionDate, action } = row;
            let obj = {};
            try {
                // Initialize obj as an empty object
                // Check if requestBodyObj is a string and not empty
                if (typeof requestBodyObj === 'string' && requestBodyObj) {
                    // Parse requestBodyObj as JSON
                    obj = JSON.parse(requestBodyObj);
                }
                console.log('🚀 ~ .map ~ obj:', obj);
            }
            catch (error) {
                console.error('Error parsing requestBodyObj:', error);
            }
            return (<TableRow hover key={row.name}>
                        <TableCell> {fDateTime(actionDate || obj?.timestamp)} </TableCell>
                       
                        <TableCell align="center">
                          {row.adminName ? (<span>
                              {row.adminName} <Icon icon="ph:cube-duotone" color="purple"/>
                            </span>) : (row.requesterName)}
                        </TableCell>
                        <TableCell align="center">
                          {row.internalComments ? row.internalComments : ''}
                        </TableCell>
                        <TableCell align="center">{row.externelComments}</TableCell>
                       
                         <TableCell align="center">
                          <Label variant="soft" color="primary">
                            {action || obj?.event_data?.status}
                          </Label>
                        </TableCell>
                      </TableRow>);
        })}

                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}/>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <Divider />
        <TablePaginationCustom count={dataFiltered.length} page={table.page} rowsPerPage={table.rowsPerPage} onPageChange={table.onChangePage} onRowsPerPageChange={table.onChangeRowsPerPage} 
    //
    dense={table.dense}/>
      </Scrollbar>
    </div>);
};
export default LogsTable;
// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0)
            return order;
        return a[1] - b[1];
    });
    inputData = stabilizedThis.map((el) => el[0]);
    return inputData;
}
