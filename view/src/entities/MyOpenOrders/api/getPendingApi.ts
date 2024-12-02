const apiUrl = import.meta.env.VITE_TRANSACTION_URL;

const getPendingApi = async ({ id }: { id: number | null }) => {
  const queryParams = new URLSearchParams({
    id: id !== null ? String(id) : '',
  }).toString();

  const response = await fetch(`${apiUrl}/api/orders/pending?${queryParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getPendingApi;
