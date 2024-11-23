import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeService {
  getHello(): string {
    return 'Hello World!';
  }
}
