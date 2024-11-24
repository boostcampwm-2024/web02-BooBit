// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { BASE_URLS } from '../shared/consts/baseUrl';

export const handlers = [
  // DELETE 요청 핸들러
  http.delete(`${BASE_URLS.TRANSACTION}/api/orders/*`, () => {
    // 200 OK 응답 반환
    //return new HttpResponse();

    //403
    return new HttpResponse('Unauthorized', { status: 403 });
  }),
];
