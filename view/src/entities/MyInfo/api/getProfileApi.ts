import { BASE_URLS } from '../../../shared/consts/baseUrl';

const getProfileApi = async () => {
  const response = await fetch(`${BASE_URLS.AUTH}/api/auth/profile`, {
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

export default getProfileApi;
