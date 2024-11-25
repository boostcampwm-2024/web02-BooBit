import { http, HttpResponse } from 'msw';
import { BASE_URLS } from '../../shared/consts/baseUrl';

export const balanceHandlers = [
  // 거래 내역 조회 핸들러
  http.get(`${BASE_URLS.BALANCE}/api/users/orderHistory`, ({ request }) => {
    const url = new URL(request.url);
    const productId = url.searchParams.get('id');

    //  return new HttpResponse('Unauthorized', { status: 403 });

    const response = (nextId: number | null, orders: Array<object>) =>
      HttpResponse.json({ nextId, orders });

    const orders = [
      {
        orderType: 'BUY',
        coinCode: 'BTC',
        quantity: 0.0608,
        price: 30000,
        status: 'ORDERED',
        timestamp: '2024-01-15T12:34:56Z',
      },
      {
        orderType: 'SELL',
        coinCode: 'ETH',
        quantity: 1.5,
        price: 2500,
        status: 'ORDERED',
        timestamp: '2024-01-15T13:20:10Z',
      },
      {
        orderType: 'BUY',
        coinCode: 'ADA',
        quantity: 1000,
        price: 0.45,
        status: 'CANCELED',
        timestamp: '2024-01-15T14:10:30Z',
      },
      {
        orderType: 'SELL',
        coinCode: 'DOGE',
        quantity: 5000,
        price: 0.07,
        status: 'ORDERED',
        timestamp: '2024-01-15T15:05:22Z',
      },
      {
        orderType: 'BUY',
        coinCode: 'XRP',
        quantity: 300,
        price: 1.1,
        status: 'CANCELED',
        timestamp: '2024-01-15T16:45:33Z',
      },
      {
        orderType: 'SELL',
        coinCode: 'SOL',
        quantity: 20,
        price: 150,
        status: 'ORDERED',
        timestamp: '2024-01-15T17:20:50Z',
      },
      {
        orderType: 'BUY',
        coinCode: 'LTC',
        quantity: 3,
        price: 70,
        status: 'ORDERED',
        timestamp: '2024-01-15T18:05:11Z',
      },
      {
        orderType: 'SELL',
        coinCode: 'DOT',
        quantity: 10,
        price: 35,
        status: 'CANCELED',
        timestamp: '2024-01-15T19:40:22Z',
      },
      {
        orderType: 'BUY',
        coinCode: 'MATIC',
        quantity: 200,
        price: 0.8,
        status: 'CANCELED',
        timestamp: '2024-01-15T20:15:44Z',
      },
      {
        orderType: 'SELL',
        coinCode: 'BNB',
        quantity: 5,
        price: 320,
        status: 'CANCELED',
        timestamp: '2024-01-15T21:30:00Z',
      },
      // Add other orders here...
    ];

    if (productId === '') {
      return response(5, orders);
    }

    if (productId === '5') {
      return response(null, orders);
    }
  }),
];
