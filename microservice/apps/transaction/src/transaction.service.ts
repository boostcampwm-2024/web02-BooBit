import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { GrpcOrderStatusCode } from '@app/common/enums/grpc-status.enum';

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
}
