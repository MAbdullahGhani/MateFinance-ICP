import { Button, Tab, Tabs, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import axiosInstance, { endpoints } from 'src/utils/axios';
import ActionCommentModal from './components/action-comment-modal';
import FinanceKpi from './components/finance-kpi';
import UserBasicInformation from './components/user-basic-information';
import FinancialDetailsTab from './financial-details-tab';
import RequesterDetailsTab from './requester-details-tab';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import axios from 'axios';
import { CRED_HOST_API } from 'src/config-global';

const FinanceDetailsList = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams?.get('tab');

  useEffect(() => {
    if (tab) {
      setValue(tab);
    }
  }, [tab]);
  const [financialDetail, setFinancialDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kpiloading, setKpiLoading] = useState(false);
  const [value, setValue] = useState('requester-details'); // Set an initial value
  const [userFinanceKPIs, setUserFinanceKPIs] = useState();
  const [userDetail, setUserDetail] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedCreditScore, setSelectedCreditScore] = useState({});
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [rejectModal, setRejectModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [customScore, setCustomScore] = useState(0);
  const [orgTypelist, setOrgTypelist] = useState([]);
  const [creditScoreCriteriaList, setCreditScoreCriteriaList] = useState([]);
  const [scoreCount, setScoreCount] = useState(0);
  const [requesterData, setRequesterData] = useState({});
  const [userScore, setUserScore] = useState(0);
  const [orgType, setOrgType] = useState({
    organizationType: '',
    organizationTypeId: '',
  });
  const [correctionRequiredModal, setCorrectionRequiredModal] = useState(false);
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    note: '',
    errors: { note: '' },
  });
  const [lendingPartnerList, setLendingPartnerList] = useState([]);
  const [lendingPartner, setLendingPartner] = useState('');
  // const { userAttachments } = useSelector((state) => state.auth);

  const openCommentModalHandler = (item) => {
    console.log(item);
    setCustomScore(item.score);
    setSelectedCreditScore(item);
    setOpenCommentModal(true);
  };
  const handleShowFilerDetail = (file) => {
    window.open(`${userAttachments.url}${file}${userAttachments.token}`);
    console.log(`${userAttachments.url}${file}${userAttachments.token}`);
  };

  const getLendingPartnerList = async () => {
    try {
      const res = await axiosInstance.get(endpoints.admin.getPartnerBankList);
      setLendingPartnerList(res);
    } catch (err) {
      console.error(err);
    }
  };

  const getCreditScore = async () => {
    try {
      const response = await axiosInstance.post(`${endpoints.admin.financeCreditScore}`, {
        organizationType: userDetail.organizationType,
        countryName: userDetail.geoLocation.countryName,
      });
      setCreditScoreCriteriaList(response[0]);
      const score =
        parseFloat(response[0].basicInfo?.score) +
        parseFloat(response[0].minimumDays?.score) +
        parseFloat(response[0].filer?.score) +
        parseFloat(response[0].postDatedCheque?.score) +
        parseFloat(response[0].guarantor?.score) +
        parseFloat(response[0].repaymentHistory?.score) +
        parseFloat(response[0].biometricVerification?.score);
      setScoreCount(score);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getFinanceKpis = async () => {
    setKpiLoading(true);

    try {
      const response = await axiosInstance.post(`${endpoints.admin.financeKpiAdmin}`, {
        userId: id,
      });
      setUserFinanceKPIs(response);
      setKpiLoading(false);
    } catch (error) {
      console.error('Error fetching finance KPIs:', error);
      setKpiLoading(false);
    }
  };

  const getFinancialData = async () => {
    setLoading(false);
    try {
      const response = await axiosInstance.get(`${endpoints.app.getBorrowerById}/${id}`);
      setFinancialDetail(response);
      const user = await axios.post(CRED_HOST_API + '/users/getuser', {
        userId: response?.userId,
      });
      setUserDetail(user?.data?.user || {});
    } catch (error) {
      enqueueSnackbar(error?.response?.data || error, { variant: 'error' });
      setLoading(false);
    }
  };

  const financeRequestApprovedConfirmed = async () => {
    setLoading(true);

    try {
      const requestData = {
        _id: id,
        note: formState.note,
        creditId: selectedCreditScore.creditId,
        score: parseInt(customScore, 10),
      };

      const response = await axiosInstance.post(endpoints.admin.financeApproved, requestData);

      if (selectedCreditScore?.name === creditScoreCriteriaList.basicInfo?.name) {
        await axiosInstance.post(endpoints.admin.addOrganization, {
          userId: id,
          organizationType: orgType.organizationType,
          organizationTypeId: orgType.organizationTypeId,
          lendingPartner,
          score: parseInt(customScore, 10),
        });
      }

      setLoading(false);
      setOpenCommentModal(false);
      setFormState((prevState) => ({
        ...prevState,
        note: '',
        errors: {
          note: '',
          score: '',
        },
      }));

      setCustomScore(0);
      getFinancialData();
      enqueueSnackbar('Financial detail approved successfully!', { variant: 'success' });
      setApproveModal(false);
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error in Approved Request', { variant: 'error' });
      console.error(error);
    }
  };

  const getOrgsTypes = async () => {
    // await axiosInstance
    //   .get(`${endpoints.admin.businessCategory}`)
    //   .then((res) => {
    //     setOrgTypelist(res.orgType);
    //   })
    //   .catch((err) => console.log(err));
  };

  const financeRequestRejectConfirmed = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`${endpoints.admin.financeRejected}`, {
        _id: id,
        note: formState.note,
        creditId: selectedCreditScore.creditId,
      });
      setLoading(false);
      setOpenCommentModal(false);
      setFormState(() => ({
        ...formState,
        note: '',
      }));
      getFinancialData();
      enqueueSnackbar('Financial detail Rejected successfully', { variant: 'success' });
      setRejectModal(false);
      console.log(response);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Internal Server Error', { variant: 'error' });
      console.error(error.response);
    }
  };
  const financeRequestCorrectionRequired = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`${endpoints.admin.financeCorrection}`, {
        _id: id,
        note: formState.note,
        creditId: selectedCreditScore.creditId,
      });

      setLoading(false);
      setOpenCommentModal(false);
      setFormState(() => ({
        ...formState,
        note: '',
      }));
      getFinancialData();
      enqueueSnackbar('Correction required sent successfully!', { variant: 'success' });
      setCorrectionRequiredModal(false);
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Internal server error', { variant: 'error' });
      console.error(error);
    }
  };

  const openApproveModal = () => {
    let isValid = true;
    if (selectedCreditScore?.name === creditScoreCriteriaList.basicInfo?.name) {
      if (!lendingPartner) {
        setFormState((formState) => ({
          ...formState,
          errors: {
            ...formState.errors,
            lendingPartner: 'Error! Lending Partner is required',
          },
        }));
        isValid = false;
      }
    }
    if (formState.note === '') {
      setFormState((formState) => ({
        ...formState,
        errors: {
          ...formState.errors,
          note: 'Error! Note is required',
        },
      }));
      isValid = false;
    }

    const isNumeric = !isNaN(parseFloat(customScore)) && isFinite(customScore);
    if (!isNumeric) {
      setFormState((formState) => ({
        ...formState,
        errors: {
          ...formState.errors,
          score: 'Score must be a valid number',
        },
      }));
      isValid = false;
    } else if (customScore === 0 && selectedCreditScore.score !== 0) {
      setFormState((formState) => ({
        ...formState,
        errors: {
          ...formState.errors,
          score: 'Score Must be greater than 0',
        },
      }));
      isValid = false;
    } else if (customScore > selectedCreditScore.score) {
      setFormState((formState) => ({
        ...formState,
        errors: {
          ...formState.errors,
          score: `Error! Score must be less than or equal to ${selectedCreditScore.score}`,
        },
      }));
      isValid = false;
    }

    if (isValid) {
      setApproveModal(true);
    }
  };
  const handleChangeNote = (event) => {
    event.persist();

    setFormState(() => ({
      ...formState,
      note: event.target.value,
      errors: {
        ...formState.errors,
        note: '',
      },
    }));
  };
  const openCorrectionRequiredModal = () => {
    if (formState.note === '') {
      setFormState(() => ({
        ...formState,
        errors: {
          ...formState.errors,
          note: 'error',
        },
      }));
    } else {
      setCorrectionRequiredModal(true);
    }
  };
  const openRejectModal = () => {
    if (formState.note === '') {
      setFormState(() => ({
        ...formState,
        errors: {
          ...formState.errors,
          note: 'error',
        },
      }));
    } else {
      setRejectModal(true);
    }
  };

  const getHistory = async (item) => {
    setHistoryLoading(true);

    try {
      const response = await axiosInstance.post(`${endpoints.admin.getUserFinanceHistory}`, {
        userId: id,
        creditId: item?.creditId,
      });

      setHistoryList(response.reverse());
      setHistoryLoading(false);
    } catch (err) {
      console.error(err);
      setHistoryLoading(false);
    }
  };

  const showHistoryTableHandler = (item) => {
    setSelectedCreditScore(item);
    getHistory(item);
  };

  useEffect(() => {
    getFinancialData();
  }, []);

  const handleChangeTab = useCallback((event, newValue) => {
    setValue(newValue);
    setSearchParams({ tab: newValue });
  }, []);

  const handleExport = async () => {
    enqueueSnackbar('File Exporting...');
    try {
      setLoading(true);

      // First API call to export finance profile document
      const financeResponse = await axiosInstance.post(
        `${endpoints.admin.exportFinanceProfileDoc}`,
        { _id: id },
        { responseType: 'blob' }
      );
      const financeBlob = new Blob([financeResponse], { type: 'application/zip' });
      saveAs(financeBlob, `${id}_finance.zip`);

      // Second API call to download invoice financing
      const invoiceResponse = await axiosInstance.post(
        `${endpoints.admin.downloadInvoiceFinancing}`,
        { _id: id },
        { responseType: 'blob' }
      );
      const invoiceBlob = new Blob([invoiceResponse], { type: 'application/zip' });
      saveAs(invoiceBlob, `${id}_invoice.zip`);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreenCustom />}
      <div>
        <Tabs value={value} onChange={handleChangeTab} indicatorColor="primary" textColor="primary">
          <Tab label="Request Details" value="requester-details" />
          <Tab label="Financing Profile" value="financial-details" />
        </Tabs>

        {value !== 'requester-details' && (
          <UserBasicInformation
            financialDetail={financialDetail}
            subscriber={userDetail}
            creditScoreCriteriaList={creditScoreCriteriaList}
          />
        )}

        {value === 'financial-details' && (
          <FinancialDetailsTab
            financialDetail={financialDetail}
            userDetail={userDetail}
            openCommentModalHandler={openCommentModalHandler}
            handleShowFilerDetail={handleShowFilerDetail}
            selectedCreditScore={selectedCreditScore}
            creditScoreCriteriaList={creditScoreCriteriaList}
          />
        )}

        {value === 'requester-details' && (
          <RequesterDetailsTab
            financialDetail={financialDetail}
            openCommentModalHandler={openCommentModalHandler}
            showHistoryTableHandler={showHistoryTableHandler}
            selectedCreditScore={selectedCreditScore}
            historyLoading={historyLoading}
            historyList={historyList}
            creditScoreCriteriaList={creditScoreCriteriaList}
            scoreCount={scoreCount}
            requesterData={requesterData}
            // userScore={userScore}
            userDetail={userDetail}
          />
        )}
      </div>
    </>
  );
};

export default FinanceDetailsList;
