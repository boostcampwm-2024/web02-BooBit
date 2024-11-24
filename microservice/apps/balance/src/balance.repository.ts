import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { GrpcOrderStatusCode } from '@app/common/enums/grpc-status.enum';
import { CurrencyCode } from '@app/common';
import { OrderStatus } from '@app/common/enums/order-status.enum';
import { OrderType } from '@app/common/enums/order-type.enum';
import { GetTransactionsDto } from './dto/get.transactions.request.dto';
import { TradeRequestDto } from '@app/grpc/dto/trade.request.dto';
import { TradeResponseDto } from '@app/grpc/dto/trade.reponse.dto';
import { TradeBuyerRequestDto } from '@app/grpc/dto/trade.buyer.request.dto';
import { TradeSellerRequestDto } from '@app/grpc/dto/trade.seller.request.dto';
import { TradeCancelRequestDto } from '@app/grpc/dto/trade.cancel.request.dto';
import { Decimal } from '@prisma/client/runtime/library';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

@Injectable()
export class BalanceRepository {
  constructor(private prisma: PrismaService) {}

  async getBankHistory(userId: bigint, getTransactionsDto: GetTransactionsDto) {
    const { currencyCode, id } = getTransactionsDto;
    const take = 31; // 다음 페이지 존재 여부를 확인하기 위해 31개를 조회

    const where = {
      userId,
      currencyCode,
      ...(id && {
        txId: {
          lt: BigInt(id),
        },
      }),
    };

    const transactions = await this.prisma.depositWithdrawal.findMany({
      where,
      take,
      orderBy: {
        txId: 'desc', // 최신 거래내역부터 조회
      },
      select: {
        txId: true,
        txType: true,
        currencyCode: true,
        amount: true,
        createdAt: true,
      },
    });

    // 31개를 조회했다면, 마지막 항목은 다음 페이지의 시작점이 됨
    const hasNextPage = transactions.length > 30;
    const items = transactions.slice(0, 30); // 실제로는 30개만 반환
    const nextId = hasNextPage ? Number(transactions[30].txId) : null;

    return {
      items,
      nextId,
    };
  }

  async getPending(userId: bigint) {
    return await this.prisma.orderHistory.findMany({
      where: { userId, status: OrderStatus.PENDING },
      select: {
        historyId: true,
        orderType: true,
        coinCode: true,
        price: true,
        quantity: true,
        createdAt: true,
      },
    });
  }

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
          userId: BigInt(userId),
          currencyCode: currencyCode,
        },
      },
    });
  }

  async lockBalance(prisma, userId, orderPrice) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
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
        userId: BigInt(userId),
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

  async settleTransaction(tradeRequest: TradeRequestDto) {
    const { buyerRequest, sellerRequest, historyRequests } = tradeRequest;
    return await this.prisma.$transaction(async (prisma) => {
      await this.updateBuyerAsset(prisma, buyerRequest);
      await this.updateSellerAsset(prisma, sellerRequest);
      for (const historyRequest of historyRequests) {
        await this.updateOrderHistoryStatus(
          prisma,
          historyRequest.historyId,
          historyRequest.status,
        );
      }
      return new TradeResponseDto('SUCCESS');
    });
  }

  async updateBuyerAsset(prisma, buyerRequest: TradeBuyerRequestDto) {
    const { userId, paymentAmount, coinCode, receivedCoins, refund } = buyerRequest;
    await this.decreaseBuyerCurrencyBalance(
      prisma,
      userId,
      CurrencyCode.KRW,
      paymentAmount,
      refund,
    );
    await this.increaseBuyerCoinBalance(prisma, userId, coinCode, receivedCoins);
  }

  async decreaseBuyerCurrencyBalance(prisma, userId, currencyCode, payment, refund) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
          currencyCode: currencyCode,
        },
      },
      data: {
        availableBalance: {
          increment: refund,
        },
        lockedBalance: {
          decrement: payment,
        },
      },
    });
  }

  async increaseBuyerCoinBalance(prisma, userId, coinCode, receiveCoins) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
          currencyCode: coinCode,
        },
      },
      data: {
        availableBalance: {
          increment: receiveCoins,
        },
      },
    });
  }

  async updateSellerAsset(prisma, sellerRequest: TradeSellerRequestDto) {
    const { userId, coinCode, receivedAmount, soldCoins } = sellerRequest;
    await this.increaseSellerCurrencyBalance(prisma, userId, CurrencyCode.KRW, receivedAmount);
    await this.decreaseSellerCoinBalance(prisma, userId, coinCode, soldCoins);
  }

  async increaseSellerCurrencyBalance(prisma, userId, currencyCode, payment) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
          currencyCode: currencyCode,
        },
      },
      data: {
        lockedBalance: {
          increment: payment,
        },
      },
    });
  }

  async decreaseSellerCoinBalance(prisma, userId, coinCode, soldCoins) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
          currencyCode: coinCode,
        },
      },
      data: {
        availableBalance: {
          decrement: soldCoins,
        },
      },
    });
  }

  async updateOrderHistoryStatus(prisma, historyId: string, status: OrderStatus) {
    return await prisma.OrderHistory.update({
      where: {
        historyId: BigInt(historyId),
      },
      data: {
        status: status,
      },
    });
  }

  async cancelOrder(cancelRequest: TradeCancelRequestDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const { userId, historyId, coinCode, orderType } = cancelRequest;
      const priceDecimal = new Decimal(cancelRequest.price);
      const remainDecimal = new Decimal(cancelRequest.remain);

      await this.updateOrderHistoryStatus(prisma, historyId, OrderStatus.PARTIALLY_CANCELED);

      if (orderType === OrderType.BUY) {
        const refund = priceDecimal.mul(remainDecimal);
        await this.decreaseBuyerCurrencyBalance(prisma, userId, CurrencyCode.KRW, refund, refund);
      } else if (orderType === OrderType.SELL) {
        await this.decreaseBuyerCurrencyBalance(
          prisma,
          userId,
          coinCode,
          remainDecimal,
          remainDecimal,
        );
      }

      return new TradeResponseDto('SUCCESS');
    });
  }
}
