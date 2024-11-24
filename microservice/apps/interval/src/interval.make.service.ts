import { CandleDataDto } from '@app/ws/dto/candle.data.dto';
import { Injectable, Logger } from '@nestjs/common';
import { IntervalRepository } from './interval.candle.repository';
import { CurrencyCode } from '@app/common';

@Injectable()
export class IntervalMakeService {
  private readonly logger = new Logger(IntervalMakeService.name);
  private lastClose: number;

  constructor(private intervalRepository: IntervalRepository) {
    this.lastClose = 0;
  }

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
  async makeSecData(date: Date) {
    const trades = await this.intervalRepository.getTradesByDateRange(
      new Date(date.setTime(date.getTime() - 1000)),
      date,
      CurrencyCode.BTC,
    );

    if (trades.length === 0) {
      const latestTrade = await this.intervalRepository.getLatestTrade(CurrencyCode.BTC);
      this.lastClose = latestTrade ? Number(latestTrade.price) : 0;
      return new CandleDataDto({
        date,
        open: this.lastClose,
        close: this.lastClose,
        high: this.lastClose,
        low: this.lastClose,
        volume: 0,
      });
    } else {
      this.lastClose = Number(trades[trades.length - 1].price);
      return new CandleDataDto({
        date,
        open: Number(trades[0].price),
        close: Number(trades[trades.length - 1].price),
        high: Math.max(...trades.map((trade) => Number(trade.price))),
        low: Math.min(...trades.map((trade) => Number(trade.price))),
        volume: trades.reduce((acc, trade) => acc + Number(trade.quantity), 0),
      });
    }
  }
}
