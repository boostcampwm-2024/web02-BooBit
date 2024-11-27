const getOrdersApi = async ({ id }: { id: number | null }) => {
  const queryParams = new URLSearchParams({
    id: id !== null ? String(id) : '',
  }).toString();
  const apiUrl = import.meta.env.VITE_BALANCE_URL;

  const response = await fetch(`${apiUrl}/api/users/orderHistory?${queryParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getOrdersApi;
