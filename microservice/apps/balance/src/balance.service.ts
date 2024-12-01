import { OrderService } from '@app/grpc/order.interface';
import { Injectable } from '@nestjs/common';
import { BalanceRepository } from './balance.repository';
import { BalanceException } from './exception/balance.exception';
import { BALANCE_EXCEPTIONS } from './exception/balance.exceptions';
import { AssetDto } from './dto/asset.dto';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { AccountService } from '@app/grpc/account.interface';
import { AccountCreateResponseDto } from '@app/grpc/dto/account.create.response.dto';
import { AccountCreateRequestDto } from '@app/grpc/dto/account.create.request.dto';
import { GetTransactionsDto } from './dto/get.transactions.request.dto';
import { TradeRequestDto } from '@app/grpc/dto/trade.request.dto';
import { TradeCancelRequestDto } from '@app/grpc/dto/trade.cancel.request.dto';
import { AvailableBalanceResponseDto } from './dto/available.balance.response.dto';
import { roundToSix } from '@app/common/utils/number.format.util';
import { CurrencyCode } from '@app/common';
import { TradeBuyersDto } from './dto/trade.buyers.dto';
import { TradeSellersDto } from './dto/trade.sellers.dto';
import { TradeBuyerRequestDto } from '@app/grpc/dto/trade.buyer.request.dto';
import { TradeSellerRequestDto } from '@app/grpc/dto/trade.seller.request.dto';

@Injectable()
export class BalanceService implements OrderService, AccountService {
  constructor(private balanceRepository: BalanceRepository) {}

  async getOrdersHistory(userId: bigint, lastId?: number) {
    const { items, nextId } = await this.balanceRepository.getOrdersHistory(userId, lastId);
    const orders = items.map((item) => ({
      orderType: item.orderType,
      coinCode: item.coinCode,
      quantity: roundToSix(Number(item.quantity)),
      price: item.price.toFixed(0),
      status: item.status,
      timestamp: item.createdAt.toISOString(),
    }));
    return {
      nextId,
      orders,
    };
  }

  async getTransactions(userId: bigint, getTransactionsDto: GetTransactionsDto) {
    const { items, nextId } = await this.balanceRepository.getBankHistory(
      userId,
      getTransactionsDto,
    );

    const transactions = items.map((tx) => ({
      tx_type: tx.txType.toLowerCase(),
      amount:
        tx.currencyCode === CurrencyCode.KRW
          ? tx.amount.toNumber().toFixed(0)
          : roundToSix(tx.amount.toNumber()),
      currency_code: tx.currencyCode,
      timestamp: tx.createdAt.toISOString(),
    }));

    return {
      nextId,
      transactions,
    };
  }

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

  async makeBuyOrder(orderRequest: OrderRequestDto): Promise<OrderResponseDto> {
    return await this.balanceRepository.makeBuyOrder(orderRequest);
  }

  async makeSellOrder(orderRequest: OrderRequestDto): Promise<OrderResponseDto> {
    return await this.balanceRepository.makeSellOrder(orderRequest);
  }

  async settleTransaction(tradeRequests: TradeRequestDto[]) {
    const { buyers, sellers } = this.groupTradesForSettlement(tradeRequests);
    return await this.balanceRepository.settleTransaction(buyers, sellers);
  }

  groupTradesForSettlement(tradeRequests: TradeRequestDto[]) {
    const buyers = new Map<string, TradeBuyersDto>();
    const sellers = new Map<string, TradeSellersDto>();

    for (const tradeRequest of tradeRequests) {
      const { buyerRequest, sellerRequest } = tradeRequest;
      const coins = Number(buyerRequest.receivedCoins);
      const tradePayment = Number(buyerRequest.tradePrice) * coins;
      const originalPayment = Number(buyerRequest.buyerPrice) * coins;
      const refund = originalPayment - tradePayment;

      this.processBuyer(buyers, buyerRequest, originalPayment, refund, coins);

      this.processSeller(sellers, sellerRequest, tradePayment, coins);
    }

    return { buyers, sellers };
  }

  private processBuyer(
    buyers: Map<string, TradeBuyersDto>,
    buyerRequest: TradeBuyerRequestDto,
    originalPayment: number,
    refund: number,
    coins: number,
  ) {
    if (buyers.has(buyerRequest.userId)) {
      const buyer = buyers.get(buyerRequest.userId);
      buyer.add(originalPayment, refund, coins);
    } else {
      buyers.set(
        buyerRequest.userId,
        new TradeBuyersDto(
          buyerRequest.userId,
          buyerRequest.coinCode,
          originalPayment,
          refund,
          coins,
        ),
      );
    }
  }

  private processSeller(
    sellers: Map<string, TradeSellersDto>,
    sellerRequest: TradeSellerRequestDto,
    tradePayment: number,
    coins: number,
  ) {
    if (sellers.has(sellerRequest.userId)) {
      const seller = sellers.get(sellerRequest.userId);
      seller.add(tradePayment, coins);
    } else {
      sellers.set(
        sellerRequest.userId,
        new TradeSellersDto(sellerRequest.userId, sellerRequest.coinCode, tradePayment, coins),
      );
    }
  }

  async cancelOrder(cancelRequest: TradeCancelRequestDto) {
    return await this.balanceRepository.cancelOrder(cancelRequest);
  }

  async getAvailableBalance(userId: string, currencyCode: string) {
    const asset = await this.balanceRepository.getAvailableBalance(userId, currencyCode);
    return new AvailableBalanceResponseDto(Number(asset?.availableBalance || 0), currencyCode);
  }
}
