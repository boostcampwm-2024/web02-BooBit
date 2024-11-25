import { BASE_URLS } from '../../../shared/consts/baseUrl';

const getPendingApi = async () => {
  const response = await fetch(`${BASE_URLS.TRANSACTION}/api/orders/pending`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getPendingApi;
