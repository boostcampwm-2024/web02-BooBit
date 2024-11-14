const BASE_URL = 'http://172.31.99.241:3000';

const signoutApi = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('로그아웃에 실패했습니다.');
  }

  return response.json();
};

export default signoutApi;
