import { FormData } from '../model/formDataType';

// signUpApi.js
const BASE_URL = 'https://05cefaaa-612e-4624-8010-16fe9ea8a806.mock.pstmn.io';

const signUpApi = async (formData: FormData) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('회원가입에 실패했습니다.');
  }

  return response.json();
};

export default signUpApi;
