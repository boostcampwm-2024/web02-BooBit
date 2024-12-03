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
    const candles = await this.transactionRepository.getLatestCandles(timeScale, count - 1);
    const latestCandles = candles
      .map((candle) => ({
        date: candle.startTime,
        open: parseFloat(candle.openPrice),
        close: parseFloat(candle.closePrice),
        high: parseFloat(candle.highPrice),
        low: parseFloat(candle.lowPrice),
        volume: parseFloat(candle.volume),
      }))
      .reverse();

    const getNextCandleDate = (date: Date, timeScale: TimeScale): Date => {
      const nextDate = new Date(date);
      switch (timeScale) {
        case TimeScale.SEC_01:
          nextDate.setSeconds(nextDate.getSeconds() + 1);
          break;
        case TimeScale.MIN_01:
          nextDate.setMinutes(nextDate.getMinutes() + 1);
          break;
        case TimeScale.MIN_10:
          nextDate.setMinutes(nextDate.getMinutes() + 10);
          break;
        case TimeScale.MIN_30:
          nextDate.setMinutes(nextDate.getMinutes() + 30);
          break;
        case TimeScale.HOUR_01:
          nextDate.setHours(nextDate.getHours() + 1);
          break;
        case TimeScale.DAY_01:
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case TimeScale.WEEK_01:
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case TimeScale.MONTH_01:
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
      }
      return nextDate;
    };

    const lastDummyCandle = {
      date: getNextCandleDate(latestCandles[latestCandles.length - 1].date, timeScale),
      open: 0,
      close: 0,
      high: 0,
      low: 0,
      volume: 0,
    };
    latestCandles.push(lastDummyCandle);
    return latestCandles;
  }

  async getLatestTrades(count: number = 20): Promise<TradeDataDto[]> {
    const trades = await this.transactionRepository.getLatestTrades(count);
    return trades.map((trade) => ({
      tradeId: trade.tradeId,
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
