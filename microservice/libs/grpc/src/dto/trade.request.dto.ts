import { TradeBuyerRequestDto } from './trade.buyer.request.dto';
import { TradeSellerRequestDto } from './trade.seller.request.dto';

export class TradeRequestDto {
  buyerRequest: TradeBuyerRequestDto;
  sellerRequest: TradeSellerRequestDto;

  constructor(
    buyerRequest: TradeBuyerRequestDto,
    sellerRequest: TradeSellerRequestDto,
  ) {
    this.buyerRequest = buyerRequest;
    this.sellerRequest = sellerRequest;
  }
}
