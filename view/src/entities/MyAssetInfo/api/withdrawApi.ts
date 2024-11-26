import { AssetType } from '../model/AssetType';

const apiUrl = import.meta.env.VITE_BALANCE_URL;
const withdrawApi = async ({ currencyCode, amount }: AssetType) => {
  const response = await fetch(`${apiUrl}/api/users/withdraw`, {
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
