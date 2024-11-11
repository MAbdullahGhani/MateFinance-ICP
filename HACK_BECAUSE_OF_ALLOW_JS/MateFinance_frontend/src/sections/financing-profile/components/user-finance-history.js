import React from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, CardContent, Card, Box, } from '@mui/material';
import { TableNoData } from 'src/components/table';
import Iconify from 'src/components/iconify/iconify';
import { fDateTime } from 'src/utils/format-time';
import Label from 'src/components/label/label';
function UserFinanceHistory({ selectedCreditScore, historyLoading, historyList }) {
    return (<div>
      <Card sx={{ p: 3, marginTop: '35px' }}>
        <CardContent>
          <Typography variant="h5" color="secondary" component="h3" sx={{ fontWeight: 750, textAlign: 'left' }}>
            {selectedCreditScore?.name} History
          </Typography>
        </CardContent>
        <div sx={{ border: '1px solid #dbdbdb', marginBottom: '6%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {historyList.length > 0 &&
            historyList.map((history, index) => (<TableRow key={index}>
                    <TableCell>
                      <p>{fDateTime(history.Date)}</p>
                    </TableCell>
                    <TableCell>{history.status}</TableCell>
                    <TableCell>
                      {history.adminName ? (<Label color="secondary">{history.action ? history.action : ''}</Label>) : (<Label color="primary">{history.action ? history.action : ''}</Label>)}
                    </TableCell>

                    <TableCell sx={{ align: 'left' }}>
                      {history.adminName ? (<p>
                          {history.adminName} <Iconify icon="bxs:cube" sx={{ color: '#7a2978' }}/>{' '}
                        </p>) : history.userName ? (history.userName) : ('')}
                    </TableCell>
                    <TableCell sx={{ align: 'left' }}>{history.note}</TableCell>
                  </TableRow>))}
            </TableBody>
            {!historyLoading && !historyList.length && <TableNoData notFound/>}
          </Table>
        </div>
      </Card>
    </div>);
}
export default UserFinanceHistory;
