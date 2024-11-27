import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { TransactionWsService } from './transaction.ws.service';
import { WsService } from '@app/ws/ws.service';
import { WsEventDecorator } from '@app/ws/decorators/ws.event.decorator';
import { ValidateMessage } from '@app/ws/decorators/ws.validate.message.decorator';
import { SubscribeRequestDto } from '@app/ws/dto/subscribe.request.dto';
import { ChartResponseDto } from '@app/ws/dto/chart.response.dto';
import { WebSocket } from 'ws';
import { WsEvent } from '@app/common/enums/ws-event.enum';
import { RedisChannel } from '@app/common/enums/redis-channel.enum';
import cors from '@app/common/cors';
import { WsBaseGateway } from '@app/ws/ws.base.gateway';
import { Reflector } from '@nestjs/core';
import { TradeResponseDto } from '@app/ws/dto/trade.response.dto';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { WsError } from '@app/ws/ws.error';
import { roundToSix } from '@app/common/utils/number.format.util';

@WebSocketGateway({
  path: '/ws',
  cors: cors,
})
@Injectable()
export class TransactionWsGateway extends WsBaseGateway {
  private redisSubscriber: Redis | null = null;
  private reconnectInterval: NodeJS.Timer | null = null;

  constructor(
    private readonly transactionWsService: TransactionWsService,
    wsService: WsService,
    reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(wsService, reflector);
    this.connectRedis();
  }

  private connectRedis() {
    try {
      if (this.redisSubscriber) {
        this.redisSubscriber.disconnect();
      }

      this.redisSubscriber = new Redis(this.configService.get('TRADE_REDIS_URL'), {
        maxRetriesPerRequest: null,
        retryStrategy: () => null,
        enableReadyCheck: false,
      });

      this.redisSubscriber.on('error', (error) => {
        console.error('Redis PubSub connection error:', error.message);
        this.startReconnectInterval();
      });

      this.redisSubscriber.on('end', () => {
        console.error('Redis connection ended');
        this.startReconnectInterval();
      });

      this.redisSubscriber.on('ready', () => {
        console.log('Redis connected successfully');
        this.stopReconnectInterval();
        this.subscribeToChannels();
      });
    } catch (error) {
      console.error('Failed to initialize Redis connection:', error.message);
      this.redisSubscriber = null;
      this.startReconnectInterval();
    }
  }

  private startReconnectInterval() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        console.log('Attempting to reconnect to Redis...');
        this.connectRedis();
      }, 5000);
    }
  }

  private stopReconnectInterval() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval as NodeJS.Timeout);
      this.reconnectInterval = null;
    }
  }

  private subscribeToChannels() {
    if (!this.redisSubscriber) return;

    try {
      Object.values(RedisChannel).forEach((channel) => {
        this.redisSubscriber?.subscribe(channel);
      });

      this.redisSubscriber.on('message', (channel, message) => {
        try {
          const data = JSON.parse(message);
          this.handleRedisMessage(channel as RedisChannel, data);
        } catch (error) {
          console.error('Redis message parsing error:', error);
        }
      });
    } catch (error) {
      console.error('Failed to subscribe to channels:', error);
    }
  }

  private handleRedisMessage(channel: RedisChannel, data: any) {
    if (!this.redisSubscriber) return;

    switch (channel) {
      case RedisChannel.CANDLE_CHART:
        this.wsService.broadcastToRoom(data.timeScale, data);
        break;
      case RedisChannel.TRADE:
        this.wsService.broadcastToAll(data);
        break;
      case RedisChannel.BUY_AND_SELL:
        this.wsService.broadcastToAll(data);
        break;
    }
  }

  @WsEventDecorator(WsEvent.CANDLE_CHART_INIT)
  async handleSubscribe(
    client: WebSocket,
    @ValidateMessage(SubscribeRequestDto) data: SubscribeRequestDto,
  ) {
    try {
      this.wsService.moveClientToRoom(client, data.timeScale);
      const [chartInitResponse, tradeResponse] = await this.getInitialData(data.timeScale);

      client.send(JSON.stringify(chartInitResponse));
      client.send(JSON.stringify(tradeResponse));
    } catch (error) {
      console.error('Error in handleSubscribe:', error);
      throw new WsError(WsEvent.CANDLE_CHART_INIT, 'Failed to fetch data');
    }
  }

  async getInitialData(timeScale: TimeScale): Promise<[ChartResponseDto, TradeResponseDto]> {
    const candleData = await this.transactionWsService.getLatestCandles(timeScale);
    const tradeData = await this.transactionWsService.getLatestTrades();
    const lastDayClose = await this.transactionWsService.getLastDayClosePrice();

    const formattedTradeData = tradeData.map((trade) => ({
      ...trade,
      price: roundToSix(trade.price),
      amount: roundToSix(trade.amount),
      tradePrice: roundToSix(trade.tradePrice),
    }));

    const chartInitResponse = {
      event: WsEvent.CANDLE_CHART_INIT,
      timeScale: timeScale,
      data: candleData,
      lastDayClose: lastDayClose,
    };
    const tradeResponse: TradeResponseDto = {
      event: WsEvent.TRADE,
      data: formattedTradeData,
    };

    return [chartInitResponse, tradeResponse];
  }
}
