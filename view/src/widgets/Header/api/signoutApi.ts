import { BASE_URLS } from '../../../shared/consts/baseUrl';

const signoutApi = async () => {
  const response = await fetch(`${BASE_URLS.AUTH}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('로그아웃에 실패했습니다.');
  }

  return response.json();
};

export default signoutApi;
