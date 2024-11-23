import { BASE_URLS } from '../../../shared/consts/baseUrl';
import { TransactionsRequestType } from '../model/TransactionsRequestType';

const getTransactionsApi = async (requestData: TransactionsRequestType) => {
  const queryParams = new URLSearchParams({
    currencyCode: requestData.currencyCode,
    id: requestData.id !== null ? String(requestData.id) : '',
  }).toString();

  const response = await fetch(`${BASE_URLS.BALANCE}/api/users/transactions?${queryParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getTransactionsApi;
