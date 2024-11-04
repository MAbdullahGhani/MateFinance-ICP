import { useEffect, useState } from 'react';
// @mui
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// components
import {
  Card,
  CardContent,
  Collapse,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
// import { useSelector } from 'react-redux';
import { varFade } from 'src/components/animate';
import FileThumbnail from 'src/components/file-thumbnail';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
import { fDate } from 'src/utils/format-time';
import useTableDocument from 'src/sections/financing-profile/hooks/useTableDocument';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { enqueueSnackbar } from 'notistack';
// import { BANK_STATEMENTS } from 'src/config-global';
import Swal from 'sweetalert2';
import { IM_ATTACHMENT_TOKEN, IM_ATTACHMENT_URL } from 'src/config-global';

// ----------------------------------------------------------------------

const FinanceProfileDocumentTable = ({ documents, userDetail }) => {
  // const {
  //   auth: { userAttachments },
  // } = useSelector((state) => state);
  // ----------------------------------------------------------------------

  const TABLE_HEAD = [
    { id: '', label: ' ' },
    { id: 'docType', label: 'Document Type', align: 'left' },
    { id: 'uploaded', label: 'Uploaded', align: 'left' },
  ];

  const table = useTableDocument({
    defaultOrderBy: '',
  });

  const [tableData, setTableData] = useState([]);
  const [documentTypesList, setDocumentTypesList] = useState([]);
  const docTypeSet = new Set();

  useEffect(() => {
    if (documents) {
      const docs = documents.filter((doc) => doc.nonAdditional === true);
      const docTypes = docs.map((doc) => doc.docType);
      const uniqueDocTypes = [...new Set(docTypes)];
      setDocumentTypesList(uniqueDocTypes);

      if (docs.length === 0) {
        setTableData(documents);
        setExpanded(documents.map(() => false));
      } else {
        setTableData(docs);
        setExpanded(uniqueDocTypes.map(() => false));
      }
    }
  }, [documents]);

  const dataFiltered = applyFilter({
    inputData: documentTypesList,
    comparator: getComparator(table.order, table.orderBy),
  });

  tableData.forEach((item) => {
    docTypeSet.add(item.docType);
  });

  // const denseHeight = table.dense ? 34 : 54;

  const [expanded, setExpanded] = useState('');

  const handleCollapseChange = (documentType) => {
    setExpanded((prevExpanded) => (prevExpanded === documentType ? '' : documentType));
  };

  // view attachment
  const viewAttachment = (statement) => {
    const data =
      checkType(statement) === 'base64' || checkType(statement) === 'empty'
        ? statement
        : `${IM_ATTACHMENT_URL}${statement}${IM_ATTACHMENT_TOKEN}`;

    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', '');
    link.click();
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
    return (
      string.includes('bankstatements') || string.includes('Users') || string.includes('uploads')
    );
  }

  // Hide request graph button if requested
  const updateScannedStatus = (docId) => {
    const docs = documents.filter((doc) => doc.nonAdditional === true);
    return docs.map((doc) => {
      // If the current document's id matches the target id, update the scanned property
      if (doc._id === docId) {
        return { ...doc, scanned: true };
      }
      // Otherwise, return the document as it is
      return doc;
    });
  };

  const requestBankStatmentGraph = async (doc) => {
    try {
      Swal.fire({
        customClass: {
          container: 'swal2-container',
        },
        title: 'Requested',
        text: 'Your request for bank statement analysis is in progress, it usually takes 10 to 15 minutes...,You will recevie an email once completed',
        icon: 'success',
      });

      const updated = updateScannedStatus(doc._id);

      setTableData(updated);

      await axiosInstance.post(endpoints.finance.requestBankGraph, {
        userId: userDetail._id,
        document: { ...doc, path: `${IM_ATTACHMENT_URL}${doc.path}${IM_ATTACHMENT_TOKEN}` },
      });
    } catch (error) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      console.log('🚀 ~ getBankStatmentGraph ~ error:', error);
    }
  };
  return (
    <div>
      <Card variant="contained" style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h5" color="secondary">
            Finance Profile Documents
          </Typography>
        </CardContent>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <>
                    <TableRow hover key={index}>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleCollapseChange(row)}>
                          <Iconify
                            icon={
                              expanded === row
                                ? 'eva:arrow-ios-upward-fill'
                                : 'eva:arrow-ios-downward-fill'
                            }
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            cursor: 'pointer',
                          }}
                          onClick={() => handleCollapseChange(row)}
                        >
                          {row}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {docTypeSet.has(row) ? (
                          <Iconify icon="game-icons:check-mark" color="primary" />
                        ) : null}
                      </TableCell>
                    </TableRow>

                    <TableRow key={index}>
                      <TableCell colSpan={3} sx={{ py: 0 }}>
                        {tableData
                          .filter((item) => item.docType === row)
                          .map((doc, docIndex) => (
                            <Collapse in={expanded === doc.docType} unmountOnExit>
                              <Stack
                                {...varFade().inUp}
                                spacing={1}
                                direction="row"
                                alignItems="center"
                                sx={{
                                  my: 1,
                                  py: 1,
                                  px: 1.5,
                                  borderRadius: 1,
                                  border: (theme) =>
                                    `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`, // ...sx,
                                }}
                              >
                                <FileThumbnail file={doc} />

                                <ListItemText
                                  primary={doc?.title || doc?.fileName}
                                  secondary={doc.date ? fDate(doc.date) : new Date()}
                                  secondaryTypographyProps={{
                                    component: 'span',
                                    typography: 'caption',
                                  }}
                                />
                                {/* {doc.docType === BANK_STATEMENTS && !doc.scanned && (
                                  <Tooltip title="Request BankStatement Analysis">
                                    <IconButton
                                      size="small"
                                      onClick={() => requestBankStatmentGraph(doc)}
                                    >
                                      <Iconify icon="solar:graph-new-up-linear" width={26} />
                                    </IconButton>
                                  </Tooltip>
                                )} */}

                                <IconButton size="small" onClick={() => viewAttachment(doc?.path)}>
                                  <Iconify icon="solar:eye-bold-duotone" width={26} />
                                </IconButton>
                              </Stack>
                            </Collapse>
                          ))}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              <TableNoData notFound={!dataFiltered.length} />
              {/* <TableEmptyRows */}
              {/* height={denseHeight} */}
              {/* // emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)} */}
              {/* /> */}
            </TableBody>
          </Table>
        </Scrollbar>
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
      </Card>
    </div>
  );
};

export default FinanceProfileDocumentTable;

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
