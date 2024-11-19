import { RequestDataType } from '../model/RequestDataType';

const BASE_URLS = 'http://172.31.99.241:3000';

const postBuyApi = async (requestData: RequestDataType) => {
  const response = await fetch(`${BASE_URLS}/api/orders/limit/buy`, {
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

export default postBuyApi;
