export default {
  origin: '*',
  credentials: true,
};

// const cors = (origin, callback) => {
//   // 특정 도메인의 모든 포트 허용을 위한 정규식
//   const allowedDomains = [
//     /^http:\/\/localhost(:[0-9]+)?$/, // localhost의 모든 포트
//     /^http:\/\/127.0.0.1(:[0-9]+)?$/, // 127.0.0.1 모든 포트
//     /^http:\/\/example\.com(:[0-9]+)?$/, // example.com의 모든 포트
//     /^http:\/\/211.188.57.13(:[0-9]+)?$/, // 211.188.57.13의 모든 포트
//     'https://production.com', // 특정 도메인은 그대로 지정 가능
//   ];

//   // origin이 null인 경우는 같은 출처의 요청
//   if (
//     !origin ||
//     allowedDomains.some((domain) =>
//       domain instanceof RegExp ? domain.test(origin) : domain === origin,
//     )
//   ) {
//     callback(null, true);
//   } else {
//     callback(new Error('Not allowed by CORS'));
//   }
// };
