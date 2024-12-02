const apiUrl = import.meta.env.VITE_AUTH_URL;
const getProfileApi = async () => {
  const response = await fetch(`${apiUrl}/api/auth/profile`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default getProfileApi;
