// utils
import { enqueueSnackbar } from 'notistack';
import axios, { endpoints, getIP, jwtDecode } from 'src/utils/axios';

export const getApInvoices = async () => {
  const getApiResponse = new Promise((res, rej) => {
    try {
      const response = axios.post(endpoints.invoice.getApInvoices);
      res(response);
    } catch (error) {
      console.error('Error:', error);
      rej(error);
      enqueueSnackbar(error);
    }
  });
  const result = await getApiResponse;
  return result;
};

export const getArInvoices = async () => {
  const getApiResponse = new Promise((res, rej) => {
    try {
      const response = axios.post(endpoints.invoice.getArInvoices);
      res(response);
    } catch (error) {
      console.error('Error:', error);
      // handle the error
      rej(error);
      enqueueSnackbar(error);
    }
  });
  const result = await getApiResponse;
  return result;
};
