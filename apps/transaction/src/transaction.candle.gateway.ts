import { WebSocketGateway } from '@nestjs/websockets';
import { Reflector } from '@nestjs/core';
import { WsBaseGateway } from '@app/ws/ws.base-gateway';
import { WsService } from '@app/ws/ws.service';
import { WsEventDecorator } from '@app/ws/decorators/ws.event.decorator';
import { ValidateMessage } from '@app/ws/decorators/ws.validate.message.decorator';
import { SubscribeRequestDto } from '@app/ws/dto/chart.timeScale.subscribe.request.dto';
import { SubscribeResponseDto } from '@app/ws/dto/chart.timeScale.subscribe.response.dto';
import { WebSocket } from 'ws';
import { WsEvent } from '@app/common/enums/ws-event.enum';
import cors from '@app/common/cors';

@WebSocketGateway({
  path: '/ws',
  cors: cors,
})
export class CandleGateway extends WsBaseGateway {
  constructor(wsService: WsService, reflector: Reflector) {
    super(wsService, reflector);
  }

  @WsEventDecorator(WsEvent.CANDLE_CHART_INIT)
  handleSubscribe(
    client: WebSocket,
    @ValidateMessage(SubscribeRequestDto) data: SubscribeRequestDto,
  ) {
    this.wsService.addClientToRoom(client, data.timeScale);

    const response: SubscribeResponseDto = {
      event: WsEvent.CANDLE_CHART_INIT,
      timeScale: data.timeScale,
      data: [
        {
          date: new Date(),
          open: 50000,
          close: 51000,
          high: 52000,
          low: 49000,
          volume: 1000,
        },
      ],
    };

    client.send(JSON.stringify(response));
  }
}
