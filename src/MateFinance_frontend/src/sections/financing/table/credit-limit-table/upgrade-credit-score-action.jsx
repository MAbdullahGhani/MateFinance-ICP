// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
// components
import { Card, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// ----
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import Filer from '../../finance-profile-request/Filer';
import Guarantor from '../../finance-profile-request/Guarantor';
import PostDatedCheque from '../../finance-profile-request/PostDatedCheque';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const UpgradeCreditScore = ({ creditScoreCriteriaList, creditScore }) => {
  const { t } = useLocales();
  const TABLE_HEAD = [
    { id: '#', label: '#' },
    { id: 'name', label: t(`${lang.contact}.name`) },
    { id: 'description', label: t(`${lang.financing}.description`) },
    { id: 'status', label: t(`${lang.financing}.status`) },
    { id: 'Action', label: t(`${lang.financing}.action`) },
  ];

  // --------------------
  const router = useRouter();
  const drawer = useBoolean();
  const filer = useBoolean();
  const pdc = useBoolean();
  const colors = {
    pending: 'black',
    'in progress': '#F5BA03',
    'need more details': '#D34D80',
    approved: '#5A2C66',
    rejected: '#E6344A',
  };
  const getColor = (status) => {
    const cc = colors[status?.toLowerCase()];
    return cc;
  };
  const table = useTable({
    defaultOrderBy: '',
  });

  return (
    <>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 900 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

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
                    <TableCell
                      sx={{
                        color: `${getColor(creditScore?.basicInfo?.status)}`,
                      }}
                    >
                      {creditScore?.basicInfo?.status ? creditScore?.basicInfo?.status : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          router.push(paths.dashboard.financing.request_finance_profile)
                        }
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
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
                    <TableCell
                      sx={{
                        color: `${getColor(creditScore?.minimumDays?.status)}`,
                      }}
                    >
                      {creditScore?.minimumDays?.status ? creditScore?.minimumDays?.status : ''}
                    </TableCell>
                    <TableCell>{/* <Iconify icon="solar:pen-bold" /> */}</TableCell>
                  </TableRow>

                  {/* Filer */}
                  <TableRow hover>
                    <TableCell>
                      <b>3</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {creditScoreCriteriaList.filer ? creditScoreCriteriaList.filer.name : ''}
                      </b>
                    </TableCell>
                    <TableCell>
                      {creditScoreCriteriaList.filer
                        ? creditScoreCriteriaList.filer.description
                        : ''}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: `${getColor(creditScore?.filer?.status)}`,
                      }}
                    >
                      {creditScore?.filer?.status ? creditScore?.filer?.status : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => filer.onTrue()}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
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
                    <TableCell
                      sx={{
                        color: `${getColor(creditScore?.postDatedCheque?.status)}`,
                      }}
                    >
                      {creditScore?.postDatedCheque?.status
                        ? creditScore?.postDatedCheque?.status
                        : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => pdc.onTrue()}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
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
                    <TableCell
                      sx={{
                        color: `${getColor(creditScore?.guarantor?.status)}`,
                      }}
                    >
                      {creditScore?.guarantor?.status ? creditScore?.guarantor?.status : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => drawer.onTrue()}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
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
                    <TableCell
                      sx={{
                        color: `${getColor(creditScore?.repaymentHistory?.status)}`,
                      }}
                    >
                      {creditScore?.repaymentHistory?.status
                        ? creditScore?.repaymentHistory?.status
                        : ''}
                    </TableCell>
                    <TableCell>{/* <Iconify icon="solar:pen-bold" /> */}</TableCell>
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
                    <TableCell
                      sx={{
                        color: `${getColor(creditScore?.biometricVerification?.status)}`,
                      }}
                    >
                      {creditScore?.biometricVerification?.status
                        ? creditScore?.biometricVerification?.status
                        : ''}
                    </TableCell>
                    <TableCell>{/* <Iconify icon="solar:pen-bold" /> */}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Scrollbar>
      </Card>
      {/* Guranter Apply */}
      <Guarantor drawer={drawer} />

      {/* filer and Post Dated Cheque */}
      <Filer filer={filer} />
      <PostDatedCheque pdc={pdc} />
    </>
  );
};

export default UpgradeCreditScore;

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
