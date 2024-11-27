const apiUrl = import.meta.env.VITE_TRANSACTION_URL;
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

  const response = await fetch(`${apiUrl}/api/orders/${historyId}?${queryParams}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.ok;
};

export default deleteOrderApi;
