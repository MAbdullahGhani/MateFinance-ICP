import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import Iconify from 'src/components/iconify';
import { TableNoData, TableHeadCustom, TableSelectedAction, TablePaginationCustom, } from 'src/components/table';
import FileManagerTableRow from './file-manager-table-row';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
    { id: 'name', label: 'Name' },
    { id: 'size', label: 'Size', width: 120 },
    { id: 'type', label: 'Type', width: 120 },
    { id: 'modifiedAt', label: 'Modified', width: 140 },
    { id: 'shared', label: 'Shared', align: 'right', width: 140 },
    { id: '', width: 88 },
];
// ----------------------------------------------------------------------
export default function FileManagerTable({ table, notFound, onDeleteRow, dataFiltered, onOpenConfirm, }) {
    const theme = useTheme();
    const { dense, page, order, orderBy, rowsPerPage, 
    //
    selected, onSelectRow, onSelectAllRows, 
    //
    onSort, onChangeDense, onChangePage, onChangeRowsPerPage, } = table;
    return (<>
      <Box sx={{
            position: 'relative',
            m: theme.spacing(-2, -3, -3, -3),
        }}>
        <TableSelectedAction dense={dense} numSelected={selected.length} rowCount={dataFiltered.length} onSelectAllRows={(checked) => onSelectAllRows(checked, dataFiltered.map((row) => row.id))} action={<>
              <Tooltip title="Share">
                <IconButton color="primary">
                  <Iconify icon="solar:share-bold"/>
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton color="primary" onClick={onOpenConfirm}>
                  <Iconify icon="solar:trash-bin-trash-bold"/>
                </IconButton>
              </Tooltip>
            </>} sx={{
            pl: 1,
            pr: 2,
            top: 16,
            left: 24,
            right: 24,
            width: 'auto',
            borderRadius: 1.5,
        }}/>

        <TableContainer sx={{
            p: theme.spacing(0, 3, 3, 3),
        }}>
          <Table size={dense ? 'small' : 'medium'} sx={{
            minWidth: 960,
            borderCollapse: 'separate',
            borderSpacing: '0 16px',
        }}>
            <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} rowCount={dataFiltered.length} numSelected={selected.length} onSort={onSort} onSelectAllRows={(checked) => onSelectAllRows(checked, dataFiltered.map((row) => row.id))} sx={{
            [`& .${tableCellClasses.head}`]: {
                '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                },
                '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                },
            },
        }}/>

            <TableBody>
              {dataFiltered
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (<FileManagerTableRow key={row.id} row={row} selected={selected.includes(row.id)} onSelectRow={() => onSelectRow(row.id)} onDeleteRow={() => onDeleteRow(row.id)}/>))}

              <TableNoData notFound={notFound} sx={{
            m: -2,
            borderRadius: 1.5,
            border: `dashed 1px ${theme.palette.divider}`,
        }}/>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom count={dataFiltered.length} page={page} rowsPerPage={rowsPerPage} onPageChange={onChangePage} onRowsPerPageChange={onChangeRowsPerPage} 
    //
    dense={dense} onChangeDense={onChangeDense} sx={{
            [`& .${tablePaginationClasses.toolbar}`]: {
                borderTopColor: 'transparent',
            },
        }}/>
    </>);
}
FileManagerTable.propTypes = {
    dataFiltered: PropTypes.array,
    notFound: PropTypes.bool,
    onDeleteRow: PropTypes.func,
    onOpenConfirm: PropTypes.func,
    table: PropTypes.object,
};
