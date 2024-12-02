import { FormData } from '../model/formDataType';

const apiUrl = import.meta.env.VITE_AUTH_URL;
const signUpApi = async (formData: FormData) => {
  const response = await fetch(`${apiUrl}/api/auth/signup`, {
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
