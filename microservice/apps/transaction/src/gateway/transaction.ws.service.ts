import { Injectable } from '@nestjs/common';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { TransactionRepository } from '../transaction.repository';
import { TradeDataDto } from '@app/ws/dto/trade.data.dto';
import { CandleDataDto } from '@app/ws/dto/candle.data.dto';
import { TradeGradient } from '@app/common/enums/trade.gradient.enum';
@Injectable()
export class TransactionWsService {
  constructor(private transactionRepository: TransactionRepository) {}

  async getLastDayClosePrice(): Promise<number> {
    return await this.transactionRepository.getLastDayClosePrice();
  }

  async getLatestCandles(timeScale: TimeScale, count: number = 60): Promise<CandleDataDto[]> {
    const candles = await this.transactionRepository.getLatestCandles(timeScale, count);
    return candles
      .map((candle) => ({
        date: candle.startTime,
        open: parseFloat(candle.openPrice),
        close: parseFloat(candle.closePrice),
        high: parseFloat(candle.highPrice),
        low: parseFloat(candle.lowPrice),
        volume: parseFloat(candle.volume),
      }))
      .reverse();
  }

  async getLatestTrades(count: number = 20): Promise<TradeDataDto[]> {
    const trades = await this.transactionRepository.getLatestTrades(count);
    return trades.map((trade) => ({
      date: trade.tradedAt,
      price: parseFloat(trade.price),
      amount: parseFloat(trade.quantity),
      tradePrice: parseFloat(trade.price) * parseFloat(trade.quantity),
      gradient:
        trade.price > trades[trades.length - 1]?.price
          ? TradeGradient.POSITIVE
          : TradeGradient.NEGATIVE,
    }));
  }
}
