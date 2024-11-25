import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { GrpcOrderStatusCode } from '@app/common/enums/grpc-status.enum';
import { OrderType } from '@app/common/enums/order-type.enum';

@Injectable()
export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async registerBuyOrder(orderRequest: OrderRequestDto, orderResponse: OrderResponseDto) {
    if (orderResponse.status === GrpcOrderStatusCode.NO_BALANCE) {
      throw new BadRequestException('Not Enough Balance');
    } else if (orderResponse.status === GrpcOrderStatusCode.TRANSACTION_ERROR) {
      throw new InternalServerErrorException('Internal Server Transaction Error');
    }
    await this.transactionRepository.createBuyOrder(orderRequest, orderResponse.historyId);
  }

  async registerSellOrder(orderRequest: OrderRequestDto, orderResponse: OrderResponseDto) {
    if (orderResponse.status === GrpcOrderStatusCode.NO_BALANCE) {
      throw new BadRequestException('Not Enough Balance');
    } else if (orderResponse.status === GrpcOrderStatusCode.TRANSACTION_ERROR) {
      throw new InternalServerErrorException('Internal Server Transaction Error');
    }
    await this.transactionRepository.createSellOrder(orderRequest, orderResponse.historyId);
  }

  async validateOrderOwnership(userId: string, historyId: string, orderType: OrderType) {
    const getOrder = this.getOrderFetcher(orderType);
    const order = await getOrder(historyId);

    if (!order) {
      throw new NotFoundException(`${historyId} 주문은 이미 체결되었습니다.`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException(`${historyId} 주문을 취소할 권한이 없습니다.`);
    }
  }

  getOrderFetcher(type: OrderType) {
    return type === OrderType.BUY
      ? (historyId: string) => this.transactionRepository.findBuyOrderByHistoryId(historyId)
      : (historyId: string) => this.transactionRepository.findSellOrderByHistoryId(historyId);
  }
}
