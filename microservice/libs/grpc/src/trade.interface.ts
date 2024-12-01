import { TradeCancelRequestDto } from './dto/trade.cancel.request.dto';
import { TradeResponseDto } from './dto/trade.reponse.dto';
import { TradeRequestListDto } from './dto/trade.request.list.dto';

export interface TradeGrpcService {
  settleTransaction(tradeRequests: TradeRequestListDto): Promise<TradeResponseDto>;
  cancelOrder(cancelRequest: TradeCancelRequestDto): Promise<TradeResponseDto>;
}
