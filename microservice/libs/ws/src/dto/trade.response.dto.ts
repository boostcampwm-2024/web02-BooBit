import { WsBaseDto } from './ws.base.dto';
import { TradeDataDto } from './trade.data.dto';
export class TradeResponseDto extends WsBaseDto {
  data: TradeDataDto[];
}
