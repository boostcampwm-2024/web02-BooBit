import { FormData } from '../model/formDataType';

const BASE_URL = 'http://localhost:3000';

const signinApi = async (formData: FormData) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
};

export default signinApi;
