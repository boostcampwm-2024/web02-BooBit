import { CandleDataDto } from '@app/ws/dto/candle.data.dto';
import { Injectable, Logger } from '@nestjs/common';
import { IntervalRepository } from './interval.candle.repository';
import { CurrencyCode } from '@app/common';
import { TradeGradient } from '@app/common/enums/trade.gradient.enum';

@Injectable()
export class IntervalMakeService {
  private readonly logger = new Logger(IntervalMakeService.name);

  constructor(private intervalRepository: IntervalRepository) {}

  candleAdd(value: CandleDataDto, secData: CandleDataDto): CandleDataDto {
    return {
      date: value.date,
      open: value.open,
      high: Math.max(value.high, secData.high),
      low: Math.min(value.low, secData.low),
      close: secData.close,
      volume: value.volume + secData.volume,
    };
  }
  async makeSecData(date: Date, beforeData: CandleDataDto) {
    const startTime = new Date(date.getTime() - 1000);
    const trades = await this.intervalRepository.getTradesByDateRange(
      startTime,
      date,
      CurrencyCode.BTC,
    );

    if (trades.length === 0) {
      return {
        candle: new CandleDataDto({
          date: startTime,
          open: beforeData.close,
          close: beforeData.close,
          high: beforeData.close,
          low: beforeData.close,
          volume: 0,
        }),
        trades: [],
      };
    } else {
      return {
        candle: new CandleDataDto({
          date: startTime,
          open: Number(trades[0].price),
          close: Number(trades[trades.length - 1].price),
          high: Math.max(...trades.map((trade) => Number(trade.price))),
          low: Math.min(...trades.map((trade) => Number(trade.price))),
          volume: trades.reduce((acc, trade) => acc + Number(trade.quantity), 0),
        }),
        trades: trades.map((trade, index) => ({
          tradeId: trade.tradeId,
          date: trade.tradedAt,
          price: Number(trade.price),
          amount: Number(trade.quantity),
          tradePrice: Number(trade.price) * Number(trade.quantity),
          gradient:
            index > 0 && Number(trade.price) > Number(trades[index - 1].price)
              ? TradeGradient.POSITIVE
              : TradeGradient.NEGATIVE,
        })),
      };
    }
  }
}
