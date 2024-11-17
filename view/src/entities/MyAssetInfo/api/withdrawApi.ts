import { BASE_URLS } from '../../../shared/consts/baseUrl';
import { AssetType } from '../consts/AssetType';

const withdrawApi = async ({ currencyCode, amount }: AssetType) => {
  const response = await fetch(`${BASE_URLS.BALANCE}/api/users/withdraw`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currencyCode, amount }),
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.ok;
};

export default withdrawApi;
