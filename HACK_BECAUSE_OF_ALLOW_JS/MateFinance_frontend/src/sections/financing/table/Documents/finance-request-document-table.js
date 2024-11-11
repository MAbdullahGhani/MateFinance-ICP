/* eslint-disable no-shadow */
import { useState, useEffect } from 'react';
// @mui
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useTable, emptyRows, TableEmptyRows, TableHeadCustom, TableSelectedAction, TablePaginationCustom, TableNoData, } from 'src/components/table';
import { fDate, fDateTime } from 'src/utils/format-time';
import { HOST_API } from 'src/config-global';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import { useSelector } from 'react-redux';
import { Card, Collapse, ListItemText, Stack, Typography, alpha } from '@mui/material';
import { useSearchParams } from 'src/routes/hook';
import { varFade } from 'src/components/animate';
import FileThumbnail from 'src/components/file-thumbnail';
// ----------------------------------------------------------------------
const FinanceRequestDocumentTable = ({ documents, isReqPage }) => {
    //   get Param id
    const param = useSearchParams();
    const invoiceId = param.get('ReqId');
    const { auth: { userAttachments }, } = useSelector((state) => state);
    // ----------------------------------------------------------------------
    const { t } = useLocales();
    const TABLE_HEAD = [
        // { id: '', label: '' },
        { id: 'docType', label: 'Document Type', align: 'left' },
        // { id: 'Date', label: t(`${lang.finReq}.date`), align: 'center' },
        // { id: 'Name', label: t(`${lang.finReq}.name`), align: 'center' },
        // { id: 'Filename', label: t(`${lang.finReq}.filename`), align: 'center' },
        // { id: 'Description', label: t(`${lang.finReq}.description`), align: 'center' },
        // { id: 'Action', label: t(`${lang.finReq}.action`), align: 'center' },
    ];
    const table = useTable({
        defaultOrderBy: '',
    });
    const [documentTypesList, setDocumentTypesList] = useState([]);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        if (documents.length > 0) {
            // if user is on invoice request page
            if (isReqPage) {
                const docs = documents.filter((doc) => doc.nonAdditional === false && doc.invMongoId === invoiceId);
                const docTypes = docs.map((doc) => doc.docType);
                const uniqueDocTypes = [...new Set(docTypes)];
                setDocumentTypesList(uniqueDocTypes);
                setTableData(docs);
            }
            else {
                const docs = documents.filter((doc) => doc.nonAdditional === false);
                const docTypes = docs.map((doc) => doc.docType);
                const uniqueDocTypes = [...new Set(docTypes)];
                setDocumentTypesList(uniqueDocTypes);
                setTableData(docs);
            }
        }
    }, [documents]);
    const dataFiltered = applyFilter({
        inputData: documentTypesList,
    });
    const denseHeight = table.dense ? 34 : 54;
    // ------------------
    const [expanded, setExpanded] = useState('');
    const handleCollapseChange = (documentType) => {
        setExpanded((prevExpanded) => (prevExpanded === documentType ? '' : documentType));
    };
    // view attachment
    const viewAttachment = (statement) => {
        const data = checkType(statement) === 'base64' || checkType(statement) === 'empty'
            ? statement
            : `${userAttachments.url}${statement}${userAttachments.token}`;
        const newTab = window.open();
        if (newTab) {
            newTab.document.write(`<iframe style={{padding:0,margin:0}} width="100%" height="100%" src="${data}"></iframe>`);
        }
    };
    // check documnet type
    function checkType(string) {
        const contentType = string?.includes('base64');
        if (isURL(string)) {
            return 'URL';
        }
        if (contentType) {
            return 'base64';
        }
        return 'empty';
    }
    function isURL(string) {
        return (string.includes('bankstatements') || string.includes('Users') || string.includes('uploads'));
    }
    return (<div>
      <Card>
        <Typography variant="h5" color="primary" sx={{ m: 3 }}>
          Finance Request Documents
        </Typography>
        <Scrollbar>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} rowCount={dataFiltered.length} numSelected={table.selected.length}/>

                <TableBody>
                  {dataFiltered
            ?.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
            .map((row, index) => (<>
                        <TableRow key={index}>
                          <TableCell sx={{ display: 'flex' }}>
                            <IconButton size="small" onClick={() => handleCollapseChange(row)}>
                              <Iconify icon={expanded === row
                ? 'eva:arrow-ios-upward-fill'
                : 'eva:arrow-ios-downward-fill'}/>
                            </IconButton>
                            <Typography sx={{
                cursor: 'pointer',
                pt: '2.5px',
            }} onClick={() => handleCollapseChange(row)}>
                              {row}
                            </Typography>
                          </TableCell>
                        </TableRow>

                        <TableRow key={index}>
                          <TableCell colSpan={2} sx={{ py: 0 }}>
                            {tableData
                .filter((item) => item.docType === row)
                .map((doc, index) => (<Collapse key={index} in={expanded === doc.docType} unmountOnExit>
                                  <Stack key={index} // component={m.div}
             {...varFade().inUp} spacing={1} direction="row" alignItems="center" sx={{
                    my: 1,
                    py: 1,
                    px: 1.5,
                    borderRadius: 1,
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`, // ...sx,
                }}>
                                    <FileThumbnail file={doc}/>

                                    <ListItemText primary={doc?.title || doc?.fileName} secondary={doc.date ? fDate(doc.date) : new Date()} secondaryTypographyProps={{
                    component: 'span',
                    typography: 'caption',
                }}/>

                                    <IconButton size="small" onClick={() => viewAttachment(doc?.path)}>
                                      <Iconify icon="solar:eye-bold-duotone" width={26}/>
                                    </IconButton>
                                  </Stack>
                                </Collapse>))}
                          </TableCell>
                        </TableRow>
                      </>))}
                  {/* {!dataFiltered.length && [1, 2, 3, 4].map((i) => <TableSkeleton />)} */}
                  <TableNoData notFound={!dataFiltered.length}/>
                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}/>
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom count={dataFiltered.length} page={table.page} rowsPerPage={table.rowsPerPage} onPageChange={table.onChangePage} onRowsPerPageChange={table.onChangeRowsPerPage} 
    //
    dense={table.dense}/>
        </Scrollbar>
      </Card>
    </div>);
};
export default FinanceRequestDocumentTable;
// ----------------------------------------------------------------------
function applyFilter({ inputData }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);
    inputData = stabilizedThis.map((el) => el[0]);
    return inputData;
}
