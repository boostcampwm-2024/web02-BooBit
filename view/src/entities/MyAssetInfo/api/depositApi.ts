import { AssetType } from '../consts/AssetType';

const BASE_URL = 'http://localhost:3100';

const depositApi = async ({ currencyCode, amount }: AssetType) => {
  const response = await fetch(`${BASE_URL}/api/users/deposit`, {
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

export default depositApi;
