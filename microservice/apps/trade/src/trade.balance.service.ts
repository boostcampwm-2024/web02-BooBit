import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TradeGrpcService } from '@app/grpc/trade.interface';
import { TradeRequestDto } from '@app/grpc/dto/trade.request.dto';
import { TradeResponseDto } from '@app/grpc/dto/trade.reponse.dto';
import { TradeCancelRequestDto } from '@app/grpc/dto/trade.cancel.request.dto';

@Injectable()
export class TradeBalanceService implements OnModuleInit, TradeGrpcService {
  private tradeService;

  constructor(@Inject('TRADE_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.tradeService = this.client.getService<TradeGrpcService>('TradeService');
  }

  settleTransaction(tradeRequest: TradeRequestDto[]): Promise<TradeResponseDto> {
    return firstValueFrom(this.tradeService.settleTransaction(tradeRequest));
  }

  cancelOrder(cancelRequest: TradeCancelRequestDto): Promise<TradeResponseDto> {
    return firstValueFrom(this.tradeService.cancelOrder(cancelRequest));
  }
}
