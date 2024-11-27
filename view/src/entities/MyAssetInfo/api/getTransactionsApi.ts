import { TransactionsRequestType } from '../model/TransactionsRequestType';

const getTransactionsApi = async (requestData: TransactionsRequestType) => {
  const queryParams = new URLSearchParams({
    currencyCode: requestData.currencyCode,
    id: requestData.id !== null ? String(requestData.id) : '',
  }).toString();
  const apiUrl = import.meta.env.VITE_BALANCE_URL;

  const response = await fetch(`${apiUrl}/api/users/transactions?${queryParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getTransactionsApi;
