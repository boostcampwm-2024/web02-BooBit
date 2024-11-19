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
      data: generateRandomCandleData(new Date('2024-10-01'), 60),
    };

    client.send(JSON.stringify(response));
  }
}

// 무작위 캔들 데이터 생성 함수
function generateRandomCandleData(startDate: Date, count: number) {
  const data = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < count; i++) {
    // 기준가격 설정 (40000~60000 사이)
    const basePrice = Math.floor(Math.random() * 20000) + 40000;
    // 변동폭 설정 (최대 3000)
    const priceRange = Math.floor(Math.random() * 3000);

    // 시가와 종가 결정
    const open = basePrice;
    const close = basePrice + (Math.random() > 0.5 ? priceRange : -priceRange);

    // 고가와 저가 결정
    const high = Math.max(open, close) + Math.floor(Math.random() * 1000);
    const low = Math.min(open, close) - Math.floor(Math.random() * 1000);

    data.push({
      date: new Date(currentDate),
      open: open,
      close: close,
      high: high,
      low: low,
      volume: Math.floor(Math.random() * 10000) + 1000, // 1000~11000 사이 거래량
    });

    // 날짜 1일씩 증가
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}
