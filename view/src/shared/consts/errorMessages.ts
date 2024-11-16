const errorMessages = {
  '400': '이메일 형식과 비밀번호 조건을 모두 충족해야 합니다.',
  '401': '이메일 혹은 비밀 번호를 확인해주세요.',
  '403': '로그인이 필요한 서비스입니다.',
  '409': '이미 사용 중인 이메일 주소입니다. 다른 이메일을 사용해 주세요.',
  '500': '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',

  default: {
    signup: '회원가입에 실패했습니다. 다시 시도해 주세요.',
    signin: '로그인에 실패했습니다. 다시 시도해주세요.',
    signout: '로그아웃에 실패했습니다. 다시 시도해주세요.',
    withdraw: '출금이 실패했습니다. 문제가 지속되면 관리자에게 문의하세요.',
    deposit: '입금이 실패했습니다. 문제가 지속되면 관리자에게 문의하세요.',
    general: '요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
  },
};

export default errorMessages;
