import { FormData } from '../model/formDataType';

const BASE_URL = 'http://localhost:3100';

const signUpApi = async (formData: FormData) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
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

export default signUpApi;
