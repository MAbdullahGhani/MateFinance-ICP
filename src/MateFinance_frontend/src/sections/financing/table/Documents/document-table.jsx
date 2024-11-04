import { useEffect, useState } from 'react';
// @mui
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
// components
import { useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const DocumentsTable = ({ documents }) => {
  const {
    auth: { userAttachments },
  } = useSelector((state) => state);
  // ----------------------------------------------------------------------
  const { t } = useLocales();

  const TABLE_HEAD = [
    { id: 'Name', label: t(`${lang.finReq}.name`), align: 'center' },
    { id: 'Date', label: t(`${lang.finReq}.date`), align: 'left' },
    { id: 'Filename', label: t(`${lang.finReq}.filename`), align: 'center' },
    { id: 'Description', label: t(`${lang.finReq}.description`), align: 'center' },
    { id: 'Action', label: t(`${lang.finReq}.action`), align: 'center' },
  ];

  const table = useTable({
    defaultOrderBy: '',
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(documents);
  }, [documents]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 34 : 54;

  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.name)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary">
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                // onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     tableData.map((row) => row.name)
                //   )
                // }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <TableRow
                      hover
                      key={row.name}
                      // onClick={() => table.onSelectRow(row.name)}
                      // selected={table.selected.includes(row.name)}
                    >
                      <TableCell align="center">
                        {row?.name}
                        {/* <Label variant="soft" color="primary">
                        </Label> */}
                      </TableCell>
                      <TableCell> {fDateTime(row.date)} </TableCell>
                      <TableCell align="center">
                        {row.title
                          ? row.title
                          : `${row.filename?.split(0, 1)}.${row.filename?.split('.').pop()}`}
                      </TableCell>
                      <TableCell align="center">
                        {row.description ? row.description : 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={
                            () =>
                              window.open(
                                `${userAttachments.url}${row.path}${userAttachments.token}`
                              )
                            // console.log(`${userAttachments.url}${row.path}${userAttachments.token}`)
                          }
                        >
                          <Iconify icon="solar:eye-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {/* {!dataFiltered.length && [1, 2, 3, 4].map((i) => <TableSkeleton />)} */}
                <TableNoData notFound={!dataFiltered.length} />
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          // onChangeDense={table.onChangeDense}
        />
      </Scrollbar>
    </div>
  );
};

export default DocumentsTable;

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
