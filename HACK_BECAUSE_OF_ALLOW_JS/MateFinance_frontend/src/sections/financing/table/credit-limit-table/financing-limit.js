// @mui
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// components
import Scrollbar from 'src/components/scrollbar';
import { useTable, TableHeadCustom } from 'src/components/table';
import { fNumber } from 'src/utils/format-number';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
// ----------------------------------------------------------------------
const FinancingLimits = ({ Finscore }) => {
    const { t } = useLocales();
    const TABLE_HEAD = [
        { id: 'Level', label: t(`${lang.financing}.level`) },
        { id: 'Amount From', label: t(`${lang.financing}.amountFrom`) },
        { id: 'Amount To', label: t(`${lang.financing}.amountTo`) },
        { id: 'Eligibility Credit Score', label: t(`${lang.financing}.eligibilityCreditScore`) },
    ];
    // ----------------------------------------------------------------------
    const table = useTable({
        defaultOrderBy: '',
    });
    const getSortedList = (list) => {
        const sorted = list.sort((a, b) => (a.level > b.level ? 1 : -1));
        return sorted;
    };
    return (<div>
      <Scrollbar>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 900 }}>
              <TableHeadCustom headLabel={TABLE_HEAD}/>

              {getSortedList(Finscore).length !== 0 && (<TableBody>
                  {getSortedList(Finscore).map((limit, index) => (<TableRow key={index} hover>
                      <TableCell>
                        <b> {limit.level}</b>
                      </TableCell>
                      <TableCell>RS {fNumber(limit.amountFrom)}</TableCell>
                      <TableCell>
                        {limit.amountTo === 'Above'
                    ? limit.amountTo
                    : `RS ${fNumber(limit.amountTo)}`}
                      </TableCell>
                      <TableCell>{fNumber(limit.score)}</TableCell>
                    </TableRow>))}
                </TableBody>)}
            </Table>
          </Scrollbar>
        </TableContainer>
      </Scrollbar>
    </div>);
};
export default FinancingLimits;
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
