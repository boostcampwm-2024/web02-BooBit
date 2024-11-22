import { BASE_URLS } from '../../../shared/consts/baseUrl';

const getPendingApi = async () => {
  const response = await fetch(`${BASE_URLS.BALANCE}/api/users/pending`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getPendingApi;
