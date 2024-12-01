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
import { TradeResponseDto } from '@app/grpc/dto/trade.reponse.dto';
import { TradeCancelRequestDto } from '@app/grpc/dto/trade.cancel.request.dto';
import { TradeBuyersDto } from './dto/trade.buyers.dto';
import { TradeSellersDto } from './dto/trade.sellers.dto';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

@Injectable()
export class BalanceRepository {
  constructor(private prisma: PrismaService) {}

  async getOrdersHistory(userId: bigint, id?: number) {
    const take = 31;

    const orders = await this.prisma.orderHistory.findMany({
      where: {
        userId,
        ...(id && {
          historyId: {
            lte: BigInt(id),
          },
        }),
      },
      take,
      orderBy: {
        historyId: 'desc',
      },
      select: {
        historyId: true,
        orderType: true,
        coinCode: true,
        price: true,
        quantity: true,
        status: true,
        createdAt: true,
      },
    });

    const hasNextPage = orders.length > 30;
    const items = orders.slice(0, 30);
    const nextId = hasNextPage ? Number(orders[30].historyId) : null;

    return {
      items,
      nextId,
    };
  }

  async getBankHistory(userId: bigint, getTransactionsDto: GetTransactionsDto) {
    const { currencyCode, id } = getTransactionsDto;
    const take = 31;

    const where = {
      userId,
      currencyCode,
      ...(id && {
        txId: {
          lte: BigInt(id),
        },
      }),
    };

    const transactions = await this.prisma.depositWithdrawal.findMany({
      where,
      take,
      orderBy: {
        txId: 'desc',
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
        const asset = await this.getAvailableBalanceTx(prisma, userId, CurrencyCode.KRW);
        if (asset.availableBalance < orderPrice) {
          return new OrderResponseDto(GrpcOrderStatusCode.NO_BALANCE, 'NONE');
        }

        await this.lockBalance(prisma, userId, CurrencyCode.KRW, orderPrice);
        const historyId = await this.createOrderHistory(
          prisma,
          OrderType.BUY,
          userId,
          coinCode,
          price,
          amount,
          OrderStatus.ORDERED,
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
        const asset = await this.getAvailableBalanceTx(prisma, userId, coinCode);
        if (asset.availableBalance < amount) {
          return new OrderResponseDto(GrpcOrderStatusCode.NO_BALANCE, 'NONE');
        }

        await this.lockBalance(prisma, userId, coinCode, amount);
        const historyId = await this.createOrderHistory(
          prisma,
          OrderType.SELL,
          userId,
          coinCode,
          price,
          amount,
          OrderStatus.ORDERED,
        );
        return new OrderResponseDto(GrpcOrderStatusCode.SUCCESS, historyId);
      });
    } catch {
      return new OrderResponseDto(GrpcOrderStatusCode.TRANSACTION_ERROR, 'NONE');
    }
  }

  async getAvailableBalanceTx(prisma, userId, currencyCode) {
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

  async lockBalance(prisma, userId, currencyCode, orderPrice) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
          currencyCode: currencyCode,
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

  async createOrderHistory(prisma, orderType, userId, coinCode, price, quantity, status) {
    const orderHistory = await prisma.orderHistory.create({
      data: {
        orderType: orderType,
        userId: BigInt(userId),
        coinCode: coinCode,
        price: price,
        quantity: quantity,
        status: status,
      },
      select: {
        historyId: true,
      },
    });
    return orderHistory.historyId;
  }

  async settleTransaction(
    buyers: Map<string, TradeBuyersDto>,
    sellers: Map<string, TradeSellersDto>,
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const buyerUpdates = this.prepareBuyerUpdates(buyers);
      const sellerUpdates = this.prepareSellerUpdates(sellers);

      await Promise.all([
        ...buyerUpdates.map((buyer) => this.updateBuyerAsset(prisma, buyer)),
        ...sellerUpdates.map((seller) => this.updateSellerAsset(prisma, seller)),
      ]);

      return new TradeResponseDto('SUCCESS');
    });
  }

  prepareBuyerUpdates(buyers: Map<string, TradeBuyersDto>) {
    return Array.from(buyers.values());
  }

  prepareSellerUpdates(sellers: Map<string, TradeSellersDto>) {
    return Array.from(sellers.values());
  }

  async updateBuyerAsset(prisma, buyer: TradeBuyersDto) {
    const { userId, coinCode, originalPayment, refund, receivedCoins } = buyer;

    const decreaseCurrencyBalance = this.decreaseBuyerCurrencyBalance(
      prisma,
      userId,
      CurrencyCode.KRW,
      originalPayment,
      refund,
    );
    const increaseCoinBalance = this.increaseBuyerCoinBalance(
      prisma,
      userId,
      coinCode,
      receivedCoins,
    );

    await Promise.all([decreaseCurrencyBalance, increaseCoinBalance]);
  }

  async decreaseBuyerCurrencyBalance(
    prisma,
    userId: string,
    currencyCode: string,
    payment: number,
    refund: number,
  ) {
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

  async increaseBuyerCoinBalance(prisma, userId: string, coinCode: string, receiveCoins: number) {
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

  async updateSellerAsset(prisma, seller: TradeSellersDto) {
    const { userId, coinCode, tradePayment, soldCoins } = seller;

    const increaseCurrencyBalance = this.increaseSellerCurrencyBalance(
      prisma,
      userId,
      CurrencyCode.KRW,
      tradePayment,
    );
    const decreaseCoinBalance = this.decreaseSellerCoinBalance(prisma, userId, coinCode, soldCoins);

    await Promise.all([increaseCurrencyBalance, decreaseCoinBalance]);
  }

  async increaseSellerCurrencyBalance(
    prisma,
    userId: string,
    currencyCode: string,
    payment: number,
  ) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
          currencyCode: currencyCode,
        },
      },
      data: {
        availableBalance: {
          increment: payment,
        },
      },
    });
  }

  async decreaseSellerCoinBalance(prisma, userId: string, coinCode: string, soldCoins: number) {
    return await prisma.asset.update({
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
          currencyCode: coinCode,
        },
      },
      data: {
        lockedBalance: {
          decrement: soldCoins,
        },
      },
    });
  }

  async cancelOrder(cancelRequest: TradeCancelRequestDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const { userId, coinCode, orderType } = cancelRequest;
      const priceNumber = Number(cancelRequest.price);
      const remainNumber = Number(cancelRequest.remain);

      await this.createOrderHistory(
        prisma,
        orderType,
        userId,
        coinCode,
        priceNumber,
        remainNumber,
        OrderStatus.CANCELED,
      );

      if (orderType === OrderType.BUY) {
        const refund = priceNumber * remainNumber;
        await this.decreaseBuyerCurrencyBalance(prisma, userId, CurrencyCode.KRW, refund, refund);
      } else if (orderType === OrderType.SELL) {
        await this.decreaseBuyerCurrencyBalance(
          prisma,
          userId,
          coinCode,
          remainNumber,
          remainNumber,
        );
      }

      return new TradeResponseDto('SUCCESS');
    });
  }

  async getAvailableBalance(userId, currencyCode) {
    return await this.prisma.asset.findUnique({
      select: { availableBalance: true },
      where: {
        userId_currencyCode: {
          userId: BigInt(userId),
          currencyCode: currencyCode,
        },
      },
    });
  }
}
