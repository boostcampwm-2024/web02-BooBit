import { BASE_URLS } from '../../../shared/consts/baseUrl';

const getAssetsApi = async () => {
  const response = await fetch(`${BASE_URLS.BALANCE}/api/users/assets`, {
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

export default getAssetsApi;
