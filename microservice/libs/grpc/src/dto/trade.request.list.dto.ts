import { TradeRequestDto } from './trade.request.dto';

export class TradeRequestListDto {
  tradeRequests: TradeRequestDto[];

  constructor(tradeRequests: TradeRequestDto[]) {
    this.tradeRequests = tradeRequests;
  }
}
