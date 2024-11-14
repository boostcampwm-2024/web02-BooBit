const BASE_URL = 'http://localhost:3100';

const getAssetsApi = async () => {
  const response = await fetch(`${BASE_URL}/api/users/assets`, {
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
