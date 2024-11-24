import { TradeCancelRequestDto } from './dto/trade.cancel.request.dto';
import { TradeResponseDto } from './dto/trade.reponse.dto';
import { TradeRequestDto } from './dto/trade.request.dto';

export interface TradeGrpcService {
  settleTransaction(tradeRequest: TradeRequestDto): Promise<TradeResponseDto>;
  cancelOrder(cancelRequest: TradeCancelRequestDto): Promise<TradeResponseDto>;
}
