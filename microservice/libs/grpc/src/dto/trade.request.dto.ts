import { TradeBuyerRequestDto } from './trade.buyer.request.dto';
import { TradeHistoryRequestDto } from './trade.history.request.dto';
import { TradeSellerRequestDto } from './trade.seller.request.dto';

export class TradeRequestDto {
  buyerRequest: TradeBuyerRequestDto;
  sellerRequest: TradeSellerRequestDto;
  historyRequests: TradeHistoryRequestDto[];

  constructor(
    buyerRequest: TradeBuyerRequestDto,
    sellerRequest: TradeSellerRequestDto,
    historyRequests: TradeHistoryRequestDto[],
  ) {
    this.buyerRequest = buyerRequest;
    this.sellerRequest = sellerRequest;
    this.historyRequests = historyRequests;
  }
}
