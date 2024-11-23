import { TradeGradient } from '@app/common/enums/trade.gradient.enum';
import { IsEnum } from 'class-validator';
export class TradeDataDto {
  date: Date;
  price: number;
  amount: number;
  tradePrice: number;
  @IsEnum(TradeGradient)
  gradient: TradeGradient;
}
