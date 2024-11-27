import { RequestDataType } from '../model/RequestDataType';

const apiUrl = import.meta.env.VITE_TRANSACTION_URL;
const postSellApi = async (requestData: RequestDataType) => {
  const response = await fetch(`${apiUrl}/api/orders/limit/sell`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      const error = await response.json();
      throw new Error(error.message);
    }
    throw new Error(response.status.toString());
  }

  return response.ok;
};

export default postSellApi;
