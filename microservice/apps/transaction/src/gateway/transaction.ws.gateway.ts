import { Injectable, OnModuleInit } from '@nestjs/common';
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

@WebSocketGateway({
  path: '/ws',
  cors: cors,
})
@Injectable()
export class TransactionWsGateway extends WsBaseGateway implements OnModuleInit {
  private readonly redisSubscriber: Redis;

  constructor(
    private readonly transactionWsService: TransactionWsService,
    wsService: WsService,
    reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(wsService, reflector);
    this.redisSubscriber = new Redis(this.configService.get('REDIS_PUB_SUB_URL'));
  }

  async onModuleInit() {
    // Redis 채널 구독
    Object.values(RedisChannel).forEach((channel) => {
      this.redisSubscriber.subscribe(channel);
    });

    // Redis 메시지 수신 처리
    this.redisSubscriber.on('message', (channel, message) => {
      try {
        const data = JSON.parse(message);
        this.handleRedisMessage(channel as RedisChannel, data);
      } catch (error) {
        console.error('Redis message parsing error:', error);
      }
    });
  }

  private handleRedisMessage(channel: RedisChannel, data: any) {
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
      const [chartResponse, tradeResponse] = await this.getInitialData(data.timeScale);

      client.send(JSON.stringify(chartResponse));
      client.send(JSON.stringify(tradeResponse));
    } catch (error) {
      console.error('Error in handleSubscribe:', error);
      throw new WsError(WsEvent.CANDLE_CHART_INIT, 'Failed to fetch data');
    }
  }

  async getInitialData(timeScale: TimeScale): Promise<[ChartResponseDto, TradeResponseDto]> {
    const candleData = await this.transactionWsService.getLatestCandles(timeScale);
    const tradeData = await this.transactionWsService.getLatestTrades();

    const chartResponse: ChartResponseDto = {
      event: WsEvent.CANDLE_CHART_INIT,
      timeScale: timeScale,
      data: candleData,
    };
    const tradeResponse: TradeResponseDto = {
      event: WsEvent.TRADE,
      data: tradeData,
    };

    return [chartResponse, tradeResponse];
  }
}
