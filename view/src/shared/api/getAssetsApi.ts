const apiUrl = import.meta.env.VITE_BALANCE_URL;
const getAssetsApi = async () => {
  const response = await fetch(`${apiUrl}/api/users/assets`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getAssetsApi;
