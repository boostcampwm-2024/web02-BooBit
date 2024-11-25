import { BASE_URLS } from '../../../shared/consts/baseUrl';

const getOrdersApi = async ({ id }: { id: number | null }) => {
  const queryParams = new URLSearchParams({
    id: id !== null ? String(id) : '',
  }).toString();

  const response = await fetch(`${BASE_URLS.BALANCE}/api/users/orderHistory?${queryParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getOrdersApi;
