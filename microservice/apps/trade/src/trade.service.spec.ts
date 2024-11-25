import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { TradeRepository } from './trade.repository';
import { TradeBalanceService } from './trade.balance.service';
import { OrderType } from '@app/common/enums/order-type.enum';
import { TradeRequestDto } from '@app/grpc/dto/trade.request.dto';
import { TradeBuyerRequestDto } from '@app/grpc/dto/trade.buyer.request.dto';
import { TradeSellerRequestDto } from '@app/grpc/dto/trade.seller.request.dto';
import { TradeHistoryRequestDto } from '@app/grpc/dto/trade.history.request.dto';
import { formatFixedPoint } from '@app/common/utils/number.format.util';
import { BuyOrder } from './dto/trade.buy.order.type';
import { SellOrder } from './dto/trade.sell.order.type';

jest.mock('./trade.repository');
jest.mock('./trade.balance.service');

describe('TradeService', () => {
  let tradeService: TradeService;
  let tradeRepository: jest.Mocked<TradeRepository>;
  let tradeBalanceService: jest.Mocked<TradeBalanceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeService,
        { provide: TradeRepository, useClass: TradeRepository },
        { provide: TradeBalanceService, useClass: TradeBalanceService },
      ],
    }).compile();

    tradeService = module.get<TradeService>(TradeService);
    tradeRepository = module.get(TradeRepository) as jest.Mocked<TradeRepository>;
    tradeBalanceService = module.get(TradeBalanceService) as jest.Mocked<TradeBalanceService>;

    jest.clearAllMocks();
  });

  describe('tradeBuyOrder', () => {
    it('should process buy order if order exists', async () => {
      const mockBuyOrder: BuyOrder = {
        userId: '1',
        remainingQuote: '100',
        coinCode: 'BTC',
        price: '50000',
        historyId: '',
      };
      tradeRepository.findBuyOrderByHistoryId.mockResolvedValue(mockBuyOrder);
      jest.spyOn(tradeService, 'processTrade').mockImplementation(jest.fn());

      await tradeService.tradeBuyOrder('1');

      expect(tradeRepository.findBuyOrderByHistoryId).toHaveBeenCalledWith('1');
      expect(tradeService.processTrade).toHaveBeenCalledWith(
        OrderType.BUY,
        '1',
        mockBuyOrder,
        '100',
      );
    });

    it('should not process buy order if order does not exist', async () => {
      tradeRepository.findBuyOrderByHistoryId.mockResolvedValue(null);
      jest.spyOn(tradeService, 'processTrade').mockImplementation(jest.fn());

      await tradeService.tradeBuyOrder('1');

      expect(tradeRepository.findBuyOrderByHistoryId).toHaveBeenCalledWith('1');
      expect(tradeService.processTrade).not.toHaveBeenCalled();
    });
  });

  describe('tradeSellOrder', () => {
    it('should process sell order if order exists', async () => {
      const mockSellOrder: SellOrder = {
        userId: '1',
        remainingBase: '50',
        coinCode: 'ETH',
        price: '4000',
        historyId: '',
      };
      tradeRepository.findSellOrderByHistoryId.mockResolvedValue(mockSellOrder);
      jest.spyOn(tradeService, 'processTrade').mockImplementation(jest.fn());

      await tradeService.tradeSellOrder('2');

      expect(tradeRepository.findSellOrderByHistoryId).toHaveBeenCalledWith('2');
      expect(tradeService.processTrade).toHaveBeenCalledWith(
        OrderType.SELL,
        '2',
        mockSellOrder,
        '50',
      );
    });

    it('should not process sell order if order does not exist', async () => {
      tradeRepository.findSellOrderByHistoryId.mockResolvedValue(null);
      jest.spyOn(tradeService, 'processTrade').mockImplementation(jest.fn());

      await tradeService.tradeSellOrder('2');

      expect(tradeRepository.findSellOrderByHistoryId).toHaveBeenCalledWith('2');
      expect(tradeService.processTrade).not.toHaveBeenCalled();
    });
  });

  describe('processTrade', () => {
    it('should process trades with correct orders', async () => {
      const mockOrder: BuyOrder = {
        coinCode: 'BTC',
        price: '60000',
        historyId: '',
        userId: '',
        remainingQuote: '',
      };
      const mockOrders: SellOrder[] = [
        {
          historyId: '1',
          userId: '1',
          price: '50000',
          remainingBase: '50',
          coinCode: '',
        },
      ];
      tradeRepository.findSellOrders.mockResolvedValue(mockOrders);

      jest.spyOn(tradeService, 'settleTransaction').mockResolvedValue();
      jest.spyOn(tradeService, 'updateOrderAndTradeLog').mockResolvedValue();

      await tradeService.processTrade(OrderType.BUY, '3', mockOrder, '50');

      expect(tradeRepository.findSellOrders).toHaveBeenCalledWith('BTC', '60000', 0, 30);
      expect(tradeService.settleTransaction).toHaveBeenCalledTimes(1);
      expect(tradeService.updateOrderAndTradeLog).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculateTrade', () => {
    it('should calculate trade with available amount less than remaining', () => {
      const mockOrder: SellOrder = {
        remainingBase: '50',
        historyId: '1',
        userId: '',
        coinCode: '',
        price: '',
      };
      const result = tradeService.calculateTrade(OrderType.BUY, mockOrder, 100);

      expect(result.quantity).toBe(50);
      expect(result.opposite).toEqual(new TradeHistoryRequestDto('1', 0));
    });

    it('should calculate trade with available amount greater than remaining', () => {
      const mockOrder: SellOrder = {
        remainingBase: '150',
        historyId: '1',
        userId: '',
        coinCode: '',
        price: '',
      };
      const result = tradeService.calculateTrade(OrderType.BUY, mockOrder, 100);

      expect(result.quantity).toBe(100);
      expect(result.opposite).toEqual(new TradeHistoryRequestDto('1', 50));
    });
  });

  describe('settleTransaction', () => {
    it('should settle transaction with correct buyer and seller details', async () => {
      const mockBuyerOrder: BuyOrder = {
        userId: '1',
        coinCode: 'BTC',
        price: '50000',
        historyId: '',
        remainingQuote: '',
      };
      const mockSellerOrder: SellOrder = {
        userId: '2',
        coinCode: 'BTC',
        price: '50000',
        historyId: '',
        remainingBase: '',
      };

      await tradeService.settleTransaction(
        OrderType.BUY,
        mockBuyerOrder,
        mockSellerOrder,
        50000,
        100,
      );

      expect(tradeBalanceService.settleTransaction).toHaveBeenCalledWith(
        new TradeRequestDto(
          new TradeBuyerRequestDto('1', 'BTC', 50000, 50000, 100),
          new TradeSellerRequestDto('2', 'BTC', 50000, 100),
        ),
      );
    });
  });

  describe('updateOrderAndTradeLog', () => {
    it('should call tradeBuyOrder for BUY type', async () => {
      const mockTradeHistory: TradeHistoryRequestDto = {
        historyId: '2',
        remain: 0,
      };

      await tradeService.updateOrderAndTradeLog(
        OrderType.BUY,
        '1',
        mockTradeHistory,
        'BTC',
        50000,
        100,
        50,
      );

      expect(tradeRepository.tradeBuyOrder).toHaveBeenCalledWith(mockTradeHistory, 50, '1', {
        buyOrderId: '1',
        sellOrderId: '2',
        coinCode: 'BTC',
        price: formatFixedPoint(50000),
        quantity: '100',
      });
    });

    it('should call tradeSellOrder for SELL type', async () => {
      const mockTradeHistory: TradeHistoryRequestDto = {
        historyId: '3',
        remain: 0,
      };

      await tradeService.updateOrderAndTradeLog(
        OrderType.SELL,
        '2',
        mockTradeHistory,
        'ETH',
        4000,
        50,
        0,
      );

      expect(tradeRepository.tradeSellOrder).toHaveBeenCalledWith(mockTradeHistory, 0, '2', {
        buyOrderId: '3',
        sellOrderId: '2',
        coinCode: 'ETH',
        price: formatFixedPoint(4000),
        quantity: '50',
      });
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order if order exists', async () => {
      const userId = BigInt(1);
      const historyId = '12345';
      const orderType = OrderType.BUY;
      const mockOrder: BuyOrder = {
        historyId: '12345',
        userId: 'user1',
        coinCode: 'BTC',
        price: '10000',
        remainingQuote: '1000',
      };

      tradeService.getOrderFetcher = jest
        .fn()
        .mockReturnValueOnce(jest.fn().mockResolvedValueOnce(mockOrder));
      tradeService.deleteOrderFetcher = jest
        .fn()
        .mockReturnValueOnce(jest.fn().mockResolvedValueOnce(undefined));
      tradeService.getRemain = jest.fn().mockReturnValueOnce(1000);
      tradeBalanceService.cancelOrder = jest.fn().mockResolvedValueOnce(undefined);

      await tradeService.cancelOrder(userId, historyId, orderType);

      expect(tradeService.getOrderFetcher).toHaveBeenCalledWith(orderType);
      expect(tradeService.deleteOrderFetcher).toHaveBeenCalledWith(orderType);
      expect(tradeService.getRemain).toHaveBeenCalledWith(mockOrder);
      expect(tradeBalanceService.cancelOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '1',
          coinCode: 'BTC',
          price: '10000',
          remain: 1000,
          orderType,
        }),
      );
    });

    it('should not cancel order if order does not exist', async () => {
      const userId = BigInt(1);
      const historyId = '12345';
      const orderType = OrderType.BUY;

      tradeService.getOrderFetcher = jest
        .fn()
        .mockReturnValueOnce(jest.fn().mockResolvedValueOnce(null));
      tradeService.deleteOrderFetcher = jest.fn();
      tradeService.getRemain = jest.fn();
      tradeBalanceService.cancelOrder = jest.fn();

      await tradeService.cancelOrder(userId, historyId, orderType);

      expect(tradeService.getOrderFetcher).toHaveBeenCalledWith(orderType);
      expect(tradeService.deleteOrderFetcher).not.toHaveBeenCalled();
      expect(tradeService.getRemain).not.toHaveBeenCalled();
      expect(tradeBalanceService.cancelOrder).not.toHaveBeenCalled();
    });
  });
});
