// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
// components
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, useTable } from 'src/components/table';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import { fNumber } from 'src/utils/format-number';
// ----------------------------------------------------------------------
const CreditScore = ({ scoreCount, creditScoreCriteriaList }) => {
    const { t } = useLocales();
    const TABLE_HEAD = [
        { id: '#', label: '#' },
        { id: 'name', label: t(`${lang.contact}.name`) },
        { id: 'description', label: t(`${lang.financing}.description`) },
        { id: 'score', label: t(`${lang.financing}.score`) },
        { id: 'factor', label: t(`${lang.financing}.factor`) },
    ];
    // ----------------------------------------------------------------------
    const table = useTable({
        defaultOrderBy: '',
    });
    return (<div>
      <Scrollbar>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 900 }}>
              <TableHeadCustom headLabel={TABLE_HEAD}/>

              <TableBody>
                {/* basicInfo */}
                <TableRow hover>
                  <TableCell>
                    <b>1</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {creditScoreCriteriaList.basicInfo
            ? creditScoreCriteriaList.basicInfo.name
            : ''}
                    </b>
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.basicInfo
            ? creditScoreCriteriaList.basicInfo.description
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.basicInfo
            ? fNumber(creditScoreCriteriaList.basicInfo.score)
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.basicInfo
            ? fNumber(creditScoreCriteriaList.basicInfo.parameter)
            : ''}
                  </TableCell>
                </TableRow>

                {/* minimumDays */}
                <TableRow hover>
                  <TableCell>
                    <b>2</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {creditScoreCriteriaList.minimumDays
            ? creditScoreCriteriaList.minimumDays.name
            : ''}
                    </b>
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.minimumDays
            ? creditScoreCriteriaList.minimumDays.description
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.minimumDays
            ? fNumber(creditScoreCriteriaList.minimumDays.score)
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.minimumDays
            ? fNumber(creditScoreCriteriaList.minimumDays.parameter)
            : ''}
                  </TableCell>
                </TableRow>

                {/* Filer */}
                <TableRow hover>
                  <TableCell>
                    <b>3</b>
                  </TableCell>
                  <TableCell>
                    <b>{creditScoreCriteriaList.filer ? creditScoreCriteriaList.filer.name : ''}</b>
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.filer ? creditScoreCriteriaList.filer.description : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.filer
            ? fNumber(creditScoreCriteriaList.filer.score)
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.filer
            ? fNumber(creditScoreCriteriaList.filer.parameter)
            : ''}
                  </TableCell>
                </TableRow>

                {/* postDatedCheque */}
                <TableRow hover>
                  <TableCell>
                    <b>4</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {creditScoreCriteriaList.postDatedCheque
            ? creditScoreCriteriaList.postDatedCheque.name
            : ''}
                    </b>
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.postDatedCheque
            ? creditScoreCriteriaList.postDatedCheque.description
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.postDatedCheque
            ? fNumber(creditScoreCriteriaList.postDatedCheque.score)
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.postDatedCheque
            ? fNumber(creditScoreCriteriaList.postDatedCheque.parameter)
            : ''}
                  </TableCell>
                </TableRow>

                {/* guarantor */}
                <TableRow hover>
                  <TableCell>
                    <b>5</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {creditScoreCriteriaList.guarantor
            ? creditScoreCriteriaList.guarantor.name
            : ''}
                    </b>
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.guarantor
            ? creditScoreCriteriaList.guarantor.description
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.guarantor
            ? fNumber(creditScoreCriteriaList.guarantor.score)
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.guarantor
            ? fNumber(creditScoreCriteriaList.guarantor.parameter)
            : ''}
                  </TableCell>
                </TableRow>

                {/* repaymentHistory */}
                <TableRow hover>
                  <TableCell>
                    <b>6</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {creditScoreCriteriaList.repaymentHistory
            ? creditScoreCriteriaList.repaymentHistory.name
            : ''}
                    </b>
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.repaymentHistory
            ? creditScoreCriteriaList.repaymentHistory.description
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.repaymentHistory
            ? fNumber(creditScoreCriteriaList.repaymentHistory.score)
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.repaymentHistory
            ? fNumber(creditScoreCriteriaList.repaymentHistory.parameter)
            : ''}
                  </TableCell>
                </TableRow>

                {/* biometricVerification */}
                <TableRow hover>
                  <TableCell>
                    <b>7</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {creditScoreCriteriaList.biometricVerification
            ? creditScoreCriteriaList.biometricVerification.name
            : ''}
                    </b>
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.biometricVerification
            ? creditScoreCriteriaList.biometricVerification.description
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.biometricVerification
            ? fNumber(creditScoreCriteriaList.biometricVerification.score)
            : ''}
                  </TableCell>
                  <TableCell>
                    {creditScoreCriteriaList.biometricVerification
            ? fNumber(creditScoreCriteriaList.biometricVerification.parameter)
            : ''}
                  </TableCell>
                </TableRow>

                <TableRow hover>
                  <TableCell />
                  <TableCell>
                    <b>Total</b>
                  </TableCell>
                  <TableCell />
                  <TableCell>
                    <b>{scoreCount}</b>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Scrollbar>
    </div>);
};
export default CreditScore;
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
