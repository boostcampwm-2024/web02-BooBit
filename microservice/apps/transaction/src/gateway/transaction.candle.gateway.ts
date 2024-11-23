import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { CandleService } from './transaction.candle.service';
import { WsService } from '@app/ws/ws.service';
import { WsEventDecorator } from '@app/ws/decorators/ws.event.decorator';
import { ValidateMessage } from '@app/ws/decorators/ws.validate.message.decorator';
import { SubscribeRequestDto } from '@app/ws/dto/subscribe.request.dto';
import { ChartResponseDto } from '@app/ws/dto/chart.response.dto';
import { WebSocket } from 'ws';
import { WsEvent } from '@app/common/enums/ws-event.enum';
import cors from '@app/common/cors';
import { WsBaseGateway } from '@app/ws/ws.base.gateway';
import { Reflector } from '@nestjs/core';
import { TradeResponseDto } from '@app/ws/dto/trade.response.dto';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';

@WebSocketGateway({
  path: '/ws',
  cors: cors,
})
@Injectable()
export class CandleGateway extends WsBaseGateway {
  constructor(
    private readonly candleService: CandleService,
    wsService: WsService,
    reflector: Reflector,
  ) {
    super(wsService, reflector);
  }

  @WsEventDecorator(WsEvent.CANDLE_CHART_INIT)
  async handleSubscribe(
    client: WebSocket,
    @ValidateMessage(SubscribeRequestDto) data: SubscribeRequestDto,
  ) {
    try {
      this.wsService.addClientToRoom(client, data.timeScale);

      const [chartResponse, tradeResponse] = await this.getInitialData(data.timeScale);

      client.send(JSON.stringify(chartResponse));
      client.send(JSON.stringify(tradeResponse));
    } catch (error) {
      console.error('Error in handleSubscribe:', error);
      client.send(
        JSON.stringify({
          event: 'ERROR',
          message: 'Failed to fetch candle data',
        }),
      );
    }
  }

  async getInitialData(timeScale: TimeScale): Promise<[ChartResponseDto, TradeResponseDto]> {
    const candleData = await this.candleService.getLatestCandles(timeScale);
    const tradeData = await this.candleService.getLatestTrades();

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
