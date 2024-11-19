import { OrderService } from '@app/grpc/order.interface';
import { Injectable } from '@nestjs/common';
import { BalanceRepository } from './balance.repository';
import { BalanceException } from './exception/balance.exception';
import { BALANCE_EXCEPTIONS } from './exception/balance.exceptions';
import { AssetDto } from './dto/asset.dto';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { AccountService } from '@app/grpc/account.interface';
import { AccountCreateResponseDto } from '@app/grpc/dto/account.create.response.dto';
import { AccountCreateRequestDto } from '@app/grpc/dto/account.create.request.dto';

@Injectable()
export class BalanceService implements OrderService, AccountService {
  constructor(private balanceRepository: BalanceRepository) {}

  @GrpcMethod('AccountService', 'CreateAccount')
  async createAccount(accountRequest: AccountCreateRequestDto): Promise<AccountCreateResponseDto> {
    try {
      await this.balanceRepository.createEmptyAccount(BigInt(accountRequest.userId));
      return { status: 'SUCCESS' };
    } catch {
      return { status: 'ERROR' };
    }
  }

  async deposit(userId: bigint, createTransactionDto: CreateTransactionDto) {
    const { amount } = createTransactionDto;

    if (amount <= 0) {
      throw new BalanceException(BALANCE_EXCEPTIONS.INVALID_DEPOSIT_AMOUNT);
    }
    await this.balanceRepository.deposit(userId, createTransactionDto);
    return true;
  }

  async withdraw(userId: bigint, createTransactionDto: CreateTransactionDto) {
    const { amount } = createTransactionDto;

    if (amount <= 0) {
      throw new BalanceException(BALANCE_EXCEPTIONS.INVALID_WITHDRAWAL_AMOUNT);
    }

    await this.balanceRepository.withdraw(userId, createTransactionDto);
    return true;
  }

  async getAssets(userId: bigint) {
    const assets = await this.balanceRepository.getAssets(userId);

    if (assets.length === 0) {
      throw new BalanceException(BALANCE_EXCEPTIONS.USER_ASSETS_NOT_FOUND);
    }

    return assets.map(
      (asset) =>
        new AssetDto(
          asset.currencyCode,
          asset.availableBalance.add(asset.lockedBalance).toNumber(),
        ),
    );
  }
  @GrpcMethod('OrderService', 'MakeBuyOrder')
  async makeBuyOrder(orderRequest: OrderRequestDto): Promise<OrderResponseDto> {
    return await this.balanceRepository.makeBuyOrder(orderRequest);
  }

  @GrpcMethod('OrderService', 'MakeSellOrder')
  async makeSellOrder(orderRequest: OrderRequestDto): Promise<OrderResponseDto> {
    return await this.balanceRepository.makeSellOrder(orderRequest);
  }
}
