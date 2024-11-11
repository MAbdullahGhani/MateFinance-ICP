import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography, } from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Label from 'src/components/label/label';
// import LoadingSpinner from 'src/components/loading-screen/loading-spinner';
import axiosInstance, { endpoints } from 'src/utils/axios';
// import BankStatementsGroupCharts from './components/bank-statements-group-chart';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import { useParams } from 'src/routes/hooks';
// Charts
const RiskMatrixTab = ({ userDetail }) => {
    const { id } = useParams();
    const [documents, setDocuments] = useState([]);
    const [orgType, setOrgType] = useState([]);
    const [riskMatrics, setRiskMatrics] = useState([]);
    const [afterLoanDocuments, setAfterLoanDocuments] = useState([]);
    const [bankGraph, setBankGraph] = useState({
        GroupChart: [
            {
                overview: {
                    title: 'Banks Statements Analysis',
                    chart: {
                        categories: [],
                        series: [],
                    },
                },
            },
        ],
    });
    const [loading, setLoading] = useState(0);
    const orgList = async () => {
        setLoading(true);
        try {
            const org = await axiosInstance.get(`${endpoints.admin.businessCategory}`);
            setOrgType(org.orgType);
            setRiskMatrics(org.secondaryRiskManagemenLayer);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching organization type:', error);
            setLoading(false);
        }
    };
    const orgRequiredDocumentList = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.post(`${endpoints.admin.docListWithCsIdAdmin}`, {
                organizationType: userDetail?.organizationType || 'SME',
                countryName: userDetail.geoLocation.countryName,
            });
            setDocuments(res.documentsWithCsId);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching documents list:', error);
            setLoading(false);
        }
    };
    const afterLoanDoc = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`${endpoints.admin.financeRequestDocList}`);
            const userOrg = res.financeRequestDocList.find((doc) => doc.organizationType === userDetail.organizationType);
            setAfterLoanDocuments(userOrg.financeRequestDocList);
            setLoading(false);
        }
        catch (error) {
            console.log('🚀 ~ orgList ~ error:', error);
            setLoading(false);
        }
    };
    //
    const getBankStatmentGraph = async () => {
        try {
            const res = await axiosInstance.post(endpoints.finance.bankGraph, {
                userId: id,
            });
            const transformedData = res.map((item) => organizeDataForGroupedColumns(item));
            const transformedData2 = res.map((item) => extractDataForGraph(item));
            const creditDebitOnly = res.map((item) => extractDataForOnlyCredit_DebitGraph(item));
            console.log('🚀 ~ getBankStatmentGraph ~ creditDebitOnly:', creditDebitOnly);
            setBankGraph({ GroupChart: transformedData, StackChart: transformedData2, creditDebitOnly });
        }
        catch (error) {
            console.log('🚀 ~ getBankStatmentGraph ~ error:', error);
        }
    };
    useEffect(() => {
        getBankStatmentGraph();
        orgList();
        orgRequiredDocumentList();
        afterLoanDoc();
    }, []);
    function organizeDataForGroupedColumns(data) {
        const categoriesSet = new Set();
        const series = [];
        data?.GroupChart.forEach((item) => {
            categoriesSet.add(item.Category);
        });
        const allCategories = [...categoriesSet];
        const creditSeries = [];
        const debitSeries = [];
        data?.GroupChart?.forEach((item) => {
            const creditData = item.Data.CreditAmountSum;
            const debitData = item.Data.DebitAmountSum;
            creditSeries.push(creditData);
            debitSeries.push(debitData);
        });
        series.push({
            name: 'Credit',
            data: creditSeries,
            stack: 'stack1',
        });
        series.push({
            name: 'Debit',
            data: debitSeries,
            stack: 'stack2',
        });
        return {
            id: data._id,
            graphType: data?.fileName || '-',
            title: data?.fileName || 'Bank Statement',
            chart: {
                categories: allCategories,
                series: series,
            },
            info: {
                AverageBalance: data.AverageBalance,
                FromDate: data.FromDate,
                ToDate: data.ToDate,
                filePath: data.filePath,
            },
        };
    }
    function extractDataForGraph(chartData) {
        const categoriesData = {};
        // Iterate over each month's data
        chartData?.StackChart?.forEach(({ Month, Data }) => {
            // Iterate over each category in the month's data
            Data?.forEach(({ Category, CreditAmount, DebitAmount }) => {
                // If category data doesn't exist, initialize it
                if (!categoriesData[Category]) {
                    categoriesData[Category] = Array().fill(0);
                }
                // Subtract debit from credit and accumulate the amount
                categoriesData[Category].push(CreditAmount - DebitAmount);
            });
        });
        // Convert categories data to the required format
        const data = Object.entries(categoriesData).map(([name, data]) => ({ name, data }));
        // Extract months
        const months = chartData?.StackChart?.map(({ Month }) => Month);
        return { months, data, id: chartData._id };
    }
    function extractDataForOnlyCredit_DebitGraph(chartData) {
        const categoriesData = {
            Credit: [],
            Debit: [],
            Balance: [],
        };
        // Iterate over each month's data
        chartData?.StackChart?.forEach(({ Month, Data }) => {
            // Sum up all data for the month
            let creditSum = 0;
            let debitSum = 0;
            let balanceLine = 0;
            Data?.forEach(({ CreditAmount, DebitAmount }) => {
                creditSum += CreditAmount;
                debitSum += DebitAmount;
            });
            Data?.forEach(({ CreditAmount, DebitAmount }) => {
                balanceLine += CreditAmount - DebitAmount;
            });
            // Store the sum of data for the month
            categoriesData.Credit.push(creditSum);
            categoriesData.Debit.push(-debitSum);
            categoriesData.Balance.push(balanceLine);
        });
        // Convert categories data to the required format
        const data = Object.entries(categoriesData).map(([name, data]) => {
            if (name === 'Balance') {
                return { name, data, type: 'line' };
            }
            return { name, data, type: 'column' };
        });
        // Extract months
        const months = chartData?.StackChart?.map(({ Month }) => Month);
        return { months, data, id: chartData._id };
    }
    return (<div>
      {/* INFORMATION */}
      {loading && <LoadingScreenCustom />}
      {/* CHARTS */}
      <Box sx={{ my: 4 }}/>
      {/* <BankStatementsGroupCharts chart={bankGraph} userDetail={userDetail} /> */}

      <Card style={{ marginTop: '35px', marginBottom: '4px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Loan Amount Range</TableCell>
              <TableCell>Tenure of Loan</TableCell>
              <TableCell>KYC Requirements</TableCell>
              <TableCell>Transaction History</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orgType.map((row, index) => (<TableRow hover key={index}>
                <TableCell>
                  <Typography variant="subtitle1">
                    {row.organizationType}{' '}
                    {userDetail.organizationType === row.organizationType && (<Iconify icon="material-symbols:check-circle" sx={{ color: 'purple' }}/>)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{`Min: ${row.minAmount} - Max: ${row.maxAmount}`}</Typography>
                </TableCell>
                <TableCell>{row.tenureOfLoan}</TableCell>
                <TableCell>{row.KYCRequirements}</TableCell>
                <TableCell>{row.TransactionHistory}</TableCell>
              </TableRow>))}
          </TableBody>
        </Table>{' '}
      </Card>
      {/* UPLOADED DOCUMENTS */}
      <div>
        <Card sx={{ mb: 4, mt: 4 }}>
          <CardContent>
            <Typography variant="h5">{userDetail?.organizationType}</Typography>
          </CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document Type</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Factor</TableCell>
                <TableCell>Uploaded</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((row, index) => (<TableRow hover key={index}>
                  <TableCell>{row.docType}</TableCell>
                  <TableCell>
                    {row.required ? (<Label color="primary">Required</Label>) : (<Label color="default">Not Required</Label>)}
                  </TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{row.factor}</TableCell>
                  <TableCell>
                    {userDetail.userFinance.documents.filter((d) => d.docType === row.docType)
                .length ? (<Iconify icon="game-icons:check-mark" sx={{ color: 'green' }}/>) : (<Iconify icon="ic:baseline-clear" sx={{ color: 'red' }}/>)}
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary">
            Secondary Risk Management
          </Typography>
        </CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Required</TableCell>
              <TableCell>Extra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {riskMatrics.map((row) => (<TableRow hover key={row._id}>
                <TableCell style={{ width: '40%' }}>
                  <Typography>{row.name}</Typography>
                </TableCell>
                <TableCell>
                  {row.required ? (<Label color="primary">Required</Label>) : (<Label color="default">Not Required</Label>)}
                </TableCell>
                <TableCell style={{ width: '20%' }}>
                  <Typography>
                    {/* {row.name === 'Invoice/Transaction Fraud Check' ? 'Valid' : 'Not Valid'} */}
                    Valid
                  </Typography>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">
            After Loan
          </Typography>
        </CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Type</TableCell>
              <TableCell>Required</TableCell>

              <TableCell>Uploaded</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {afterLoanDocuments.map((row) => (<TableRow hover key={row._id}>
                <TableCell>{row.docType}</TableCell>
                <TableCell>
                  {' '}
                  {row.required ? (<Label color="primary">Required</Label>) : (<Label color="default">Not Required</Label>)}
                </TableCell>

                <TableCell>
                  {userDetail.userFinance.documents.filter((d) => d.docType === row.docType)
                .length ? (<Iconify icon="game-icons:check-mark" sx={{ color: 'green' }}/>) : (<Iconify icon="ic:baseline-clear" sx={{ color: 'red' }}/>)}
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>);
};
export default RiskMatrixTab;
