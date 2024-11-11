import React, { useEffect, useState } from 'react';
import { Card, IconButton, Typography, CardHeader, ListItemText, Tooltip, Stack, } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { TableNoData } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import axios, { endpoints } from 'src/utils/axios';
import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateTime, fTime } from 'src/utils/format-time';
import { handleCopy, shortenHash } from 'src/utils/change-case';
import { useAuthContext } from 'src/auth/hooks';
import Label from 'src/components/label';
import { IM_HOST_ARB_EXPLORER, IM_HOST_EXPLORER } from 'src/config-global';
const Transaction = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { user, authenticated } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [lenderTransaction, setLenderTransaction] = useState([]);
    useEffect(() => {
        getTransaction();
    }, []);
    const getTransaction = async () => {
        setLoading(false);
        try {
            const response = await axios.get(endpoints.app.getTransactionLender + `?lenderId=${user.id}`);
            setLenderTransaction(response);
        }
        catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
            setLoading(false);
        }
    };
    return (<div>
      <Card sx={{ mt: 2 }}>
        <CardHeader title="Transaction"/>

        <Stack sx={{
            px: 3,
        }}>
          <br />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table size={'medium'} sx={{ minWidth: 960 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Lender</TableCell>
                  <TableCell>Transaction Hash</TableCell>
                  <TableCell>Loan Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lenderTransaction?.length > 0 ? (lenderTransaction?.map((item, index) => (<TableRow key={index}>
                      <TableCell>{fDateTime(item?.createdAt)}</TableCell>
                      <TableCell>
                        <ListItemText primary={item?.dealData?.borrower?.name || ''} secondary={<Typography sx={{ fontWeight: '500' }}>
                              {/* {financialDetail?.monthlyTurnover || ''} */}
                            </Typography>}/>
                      </TableCell>
                      <TableCell>
                        <ListItemText primary={item?.lenderData?.firstName + item?.lenderData?.lastName || ''} secondary={<Typography sx={{ fontWeight: '500' }}>
                              {/* {financialDetail?.monthlyTurnover || ''} */}
                            </Typography>}/>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={item?.status === 'Lending'
                ? item?.hash
                : item?.repaymentTransectionDetails?.hash}>
                          {shortenHash(item?.status === 'Lending'
                ? item?.hash
                : item?.repaymentTransectionDetails?.hash, 10)}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {item?.status === 'Lending'
                ? fCurrency(item?.dealData?.overview?.loanAmount)
                : fCurrency(item?.repaymentAmount)}
                      </TableCell>
                      <TableCell>
                        <Label variant="outlined" color="primary">
                          {item?.status === 'Lending' ? 'LENDING' : 'REPAYMENT'}
                        </Label>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={'View Transaction'}>
                          <IconButton onClick={() => {
                if (item?.dealData?.overview?.chain === 'Haqq Network') {
                    window.open(`${IM_HOST_EXPLORER}/tx/${item?.status === 'Lending'
                        ? item?.hash
                        : item?.repaymentTransectionDetails?.hash}`);
                }
                else {
                    window.open(`${IM_HOST_ARB_EXPLORER}/tx/${item?.status === 'Lending'
                        ? item?.hash
                        : item?.repaymentTransectionDetails?.hash}`);
                }
            }}>
                            <Iconify icon="carbon:view-filled"/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={'Copy Hash'}>
                          <IconButton onClick={() => handleCopy(item?.status === 'Lending'
                ? item?.hash
                : item?.repaymentTransectionDetails?.hash)}>
                            <Iconify icon="solar:copy-bold"/>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>))) : (<TableNoData notFound={true}/>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Card>
    </div>);
};
export default Transaction;
