export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

export class TradingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TradingError';
  }
}

export class LogoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LogoutError';
  }
}

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}
