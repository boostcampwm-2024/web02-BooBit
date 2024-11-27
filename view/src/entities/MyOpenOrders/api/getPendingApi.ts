const apiUrl = import.meta.env.VITE_TRANSACTION_URL;
const getPendingApi = async () => {
  const response = await fetch(`${apiUrl}/api/orders/pending`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getPendingApi;
