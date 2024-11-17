import { BASE_URLS } from '../../../shared/consts/baseUrl';
import { FormData } from '../model/formDataType';

const signUpApi = async (formData: FormData) => {
  const response = await fetch(`${BASE_URLS.AUTH}/api/auth/signup`, {
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
