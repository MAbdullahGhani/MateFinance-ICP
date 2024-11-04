/* eslint-disable no-shadow */
// import { HOST_API } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';
import useSWR from 'swr';

const fetcher = async ({ url, body }) => {
  // /
  try {
    const response = await axiosInstance.get(url, { params: body });
    const data = await response;
    return data?.Finance?.Finance;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const useFinanceProfile = (kpiState = '') => {
  const url = `${endpoints.admin.financeIsApplied}`;
  const getKey = (body) => {
    return JSON.stringify([endpoints.admin.financeIsApplied, body]);
  };
  const body = {
    limit: 1000,
    page: 1,
    query: {},
    search: '',
    sortType: 'joiningDate',
    order: 'desc',
    type: kpiState,
  };
  const {
    data: tableData,
    error,
    mutate,
    isValidating,
    isLoading,
  } = useSWR(getKey(body), () => fetcher({ url: endpoints.admin.financeIsApplied, body }), {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });

  // const loading = !tableData && !error;

  const setTableData = (newData) => {
    mutate({
      url,
      body: {
        limit: 10000,
        page: 1,
        query: {},
        search: '',
        sortType: 'joiningDate',
        order: 'desc',
        type: kpiState,
      },
    });
  };

  const revalidate = () => {
    mutate();
  };

  return {
    tableData,
    isLoading,
    isValidating,
    error,
    setTableData,
    revalidate,
  };
};

export default useFinanceProfile;
