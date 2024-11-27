import axios, { Axios, AxiosInstance, AxiosResponse } from 'axios';
import { OrderLimitRequestDto } from './order.limit.request.dto';
import { LoginError, LogoutError, SessionError, TradingError } from './boobit.error';

export class TradingBot {
  private baseURL: string;
  private email: string | undefined;
  private password: string | undefined;
  private sessionId: string | null;
  private client: AxiosInstance;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'http://boobit.xyz';
    this.email = process.env.BOOBIT_USERNAME || 'boobot@naver.com';
    this.password = process.env.BOOBIT_PASSWORD || '1234qwer';
    this.sessionId = null;

    // Initialize axios instance without sessionId (will be updated after login)
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  private extractSessionId(cookies: string[]): string | null {
    const sessionCookie = cookies.find((cookie) => cookie.startsWith('connect.sid='));
    return sessionCookie ? sessionCookie.split(';')[0] : null;
  }

  private updateClientWithSession(): void {
    if (!this.sessionId) {
      throw new Error('Session ID is not available');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Cookie: this.sessionId,
      },
    });
  }

  public async login(): Promise<boolean> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/api/auth/login`,
        {
          email: this.email,
          password: this.password,
        },
        {
          // 요청 헤더 상세 설정
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      const cookies = response.headers['set-cookie'];
      if (cookies) {
        this.sessionId = this.extractSessionId(cookies);
        if (this.sessionId) {
          this.updateClientWithSession();
          console.log('Successfully logged in and session ID obtained');
          return true;
        }
      }
      throw new SessionError('No session ID found in response cookies');
    } catch (error) {
      throw new LoginError(
        'Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  public async initialize(): Promise<void> {
    await this.login();
    if (!this.sessionId) {
      throw new SessionError('Failed to initialize: No session ID obtained');
    }
  }

  private checkSession(): void {
    if (!this.sessionId) {
      throw new SessionError('Not logged in');
    }
  }

  public async placeBuyOrder(orderRequest: OrderLimitRequestDto) {
    this.checkSession();

    try {
      await this.client.post('/api/orders/limit/buy', orderRequest);
      console.log('Successfully Buy order placed');
    } catch (error) {
      throw new TradingError(
        'Error placing buy order:' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  public async placeSellOrder(orderRequest: OrderLimitRequestDto) {
    this.checkSession();

    try {
      await this.client.post('/api/orders/limit/sell', orderRequest);
      console.log('Successfully Sell order placed');
    } catch (error) {
      throw new TradingError(
        'Error placing sell order:' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  public async logout(): Promise<void> {
    if (!this.sessionId) {
      return;
    }

    try {
      this.checkSession();
      await this.client.post('/api/auth/logout');
      this.sessionId = null;
      console.log('Successfully logged out');
    } catch (error) {
      throw new LogoutError(
        'Logout failed:' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}
