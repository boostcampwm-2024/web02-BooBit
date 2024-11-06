import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceService {
  getHello(): string {
    return 'Hello World!';
  }
}
