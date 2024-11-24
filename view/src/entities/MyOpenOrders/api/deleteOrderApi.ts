import { BASE_URLS } from '../../../shared/consts/baseUrl';

const deleteOrderApi = async ({
  historyId,
  orderType,
}: {
  historyId: number;
  orderType: 'BUY' | 'SELL';
}) => {
  const queryParams = new URLSearchParams({
    orderType: orderType,
  }).toString();

  const response = await fetch(`${BASE_URLS.TRANSACTION}/api/orders/${historyId}?${queryParams}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.ok;
};

export default deleteOrderApi;
