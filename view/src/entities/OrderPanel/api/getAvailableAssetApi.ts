const apiUrl = import.meta.env.VITE_BALANCE_URL;
const getAvailableAssetApi = async ({ currencyCode }: { currencyCode: string }) => {
  const response = await fetch(`${apiUrl}/api/users/available/${currencyCode}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getAvailableAssetApi;
