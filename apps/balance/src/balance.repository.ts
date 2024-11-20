import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { GrpcOrderStatusCode } from '@app/common/enums/grpc-status.enum';
import { CurrencyCode } from '@app/common';
import { OrderStatus } from '@app/common/enums/order-status.enum';
import { OrderType } from '@app/common/enums/order-type.enum';
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

@Injectable()
export class BalanceRepository {
  constructor(private prisma: PrismaService) {}

  async createEmptyAccount(userId: bigint) {
    await this.prisma.asset.createMany({
      data: [
        { userId, currencyCode: CurrencyCode.KRW, availableBalance: 0, lockedBalance: 0 },
        { userId, currencyCode: CurrencyCode.BTC, availableBalance: 0, lockedBalance: 0 },
      ],
    });
  }

  async deposit(userId: bigint, createTransactionDto: CreateTransactionDto) {
    const { currencyCode, amount } = createTransactionDto;
    return await this.prisma.$transaction(async (prisma) => {
      const asset = prisma.asset.upsert({
        where: {
          userId_currencyCode: {
            userId,
            currencyCode,
          },
        },
        create: {
          userId,
          currencyCode,
          availableBalance: amount,
          lockedBalance: 0,
        },
        update: {
          availableBalance: {
            increment: amount,
          },
        },
      });

      const depositTransaction = prisma.depositWithdrawal.create({
        data: {
          userId,
          currencyCode,
          txType: TransactionType.DEPOSIT,
          amount: amount,
        },
      });

      const [assetResult, depositTransactionResult] = await Promise.all([
        asset,
        depositTransaction,
      ]);

      return {
        depositTransactionResult,
        newBalance: assetResult.availableBalance,
      };
    });
  }

  async withdraw(userId: bigint, createTransactionDto: CreateTransactionDto) {
    return this.prisma.$transaction(async (prisma) => {
      const { currencyCode, amount } = createTransactionDto;

      const asset = await prisma.asset.findUnique({
        where: {
          userId_currencyCode: {
            userId,
            currencyCode,
          },
        },
      });

      if (!asset || asset.availableBalance.lessThan(amount)) {
        throw new BadRequestException('잔액 불충분');
      }

      const updatedAsset = prisma.asset.update({
        where: {
          userId_currencyCode: {
            userId,
            currencyCode,
          },
        },
        data: {
          availableBalance: {
            decrement: amount,
          },
        },
      });

      const makeHistory = prisma.depositWithdrawal.create({
        data: {
          userId,
          currencyCode,
          txType: TransactionType.WITHDRAWAL,
          amount: amount,
        },
      });

      const [updatedAssetResult, makeHistoryResult] = await Promise.all([
        updatedAsset,
        makeHistory,
      ]);

      return {
        makeHistoryResult,
        newBalance: updatedAssetResult.availableBalance,
      };
    });
  }

  async getAssets(userId: bigint) {
    return await this.prisma.asset.findMany({
      select: {
        currencyCode: true,
        availableBalance: true,
        lockedBalance: true,
      },
      where: { userId },
    });
  }

  async makeBuyOrder(orderRequest: OrderRequestDto): Promise<OrderResponseDto> {
    const { userId, coinCode, amount, price } = orderRequest;
    const orderPrice = amount * price;
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const asset = await this.getAvailableBalance(prisma, userId, CurrencyCode.KRW);
        if (asset.availableBalance < orderPrice) {
          return new OrderResponseDto(GrpcOrderStatusCode.NO_BALANCE, 'NONE');
        }

        await this.lockBalance(prisma, userId, orderPrice);
        const historyId = await this.createOrderHistory(
          prisma,
          OrderType.BUY,
          userId,
          coinCode,
          price,
          amount,
        );
        return new OrderResponseDto(GrpcOrderStatusCode.SUCCESS, historyId);
      });
    } catch {
      return new OrderResponseDto(GrpcOrderStatusCode.TRANSACTION_ERROR, 'NONE');
    }
  }

  async makeSellOrder(orderRequest: OrderRequestDto): Promise<OrderResponseDto> {
    const { userId, coinCode, amount, price } = orderRequest;
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const asset = await this.getAvailableBalance(prisma, userId, coinCode);
        if (asset.availableBalance < amount) {
          return new OrderResponseDto(GrpcOrderStatusCode.NO_BALANCE, 'NONE');
        }

        await this.lockBalance(prisma, userId, amount);
        const historyId = await this.createOrderHistory(
          prisma,
          OrderType.SELL,
          userId,
          coinCode,
          price,
          amount,
        );
        return new OrderResponseDto(GrpcOrderStatusCode.SUCCESS, historyId);
      });
    } catch {
      return new OrderResponseDto(GrpcOrderStatusCode.TRANSACTION_ERROR, 'NONE');
    }
  }

  async getAvailableBalance(prisma, userId, currencyCode) {
    return await prisma.asset.findUnique({
      select: { availableBalance: true },
      where: {
        userId_currencyCode: {
          userId,
          currencyCode,
        },
      },
    });
  }

  async lockBalance(prisma, userId, orderPrice) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId,
          currencyCode: CurrencyCode.KRW,
        },
      },
      data: {
        availableBalance: {
          decrement: orderPrice,
        },
        lockedBalance: {
          increment: orderPrice,
        },
      },
    });
  }

  async createOrderHistory(prisma, orderType, userId, coinCode, price, quantity) {
    const orderHistory = await prisma.orderHistory.create({
      data: {
        orderType: orderType,
        userId: userId,
        coinCode: coinCode,
        price: price,
        status: OrderStatus.PENDING,
        quantity: quantity,
      },
      select: {
        historyId: true,
      },
    });
    return orderHistory.historyId;
  }
}
