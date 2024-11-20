import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../src/transaction.controller';
import { TransactionService } from '../src/transaction.service';
import { TransactionGrcpService } from '../src/transaction.grcp.service';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { GrpcOrderStatusCode } from '@app/common/enums/grpc-status.enum';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CurrencyCode } from '@app/common';
import { of } from 'rxjs';
import { OrderLimitRequestDto } from '../src/dto/order.limit.request.dto';

interface MockGrpcService {
  makeBuyOrder: jest.Mock;
  makeSellOrder: jest.Mock;
}

interface MockTransactionService {
  registerBuyOrder: jest.Mock;
  registerSellOrder: jest.Mock;
}

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: MockTransactionService;
  let grpcService: MockGrpcService;

  const mockTransactionService = {
    registerBuyOrder: jest.fn(),
    registerSellOrder: jest.fn(),
  };

  const mockTransactionGrpcService = {
    makeBuyOrder: jest.fn(),
    makeSellOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
        {
          provide: TransactionGrcpService,
          useValue: mockTransactionGrpcService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get(TransactionService);
    grpcService = module.get(TransactionGrcpService);
    jest.clearAllMocks();
  });

  describe('매수 주문', () => {
    const userId = '1';
    const buyLimitRequest: OrderLimitRequestDto = {
      coinCode: CurrencyCode.BTC,
      amount: 1,
      price: 50000,
    };
    const req = { user: { userId } };

    it('매수 주문이 성공적으로 처리되어야 한다', async () => {
      // Given
      const orderRequest = new OrderRequestDto(userId, buyLimitRequest);
      const successResponse = new OrderResponseDto(GrpcOrderStatusCode.SUCCESS, 'order-1');
      mockTransactionGrpcService.makeBuyOrder.mockReturnValue(of(successResponse));

      // When
      await controller.buyLimitOrder(req, buyLimitRequest);

      // Then
      expect(grpcService.makeBuyOrder).toHaveBeenCalledWith(orderRequest);
      expect(service.registerBuyOrder).toHaveBeenCalledWith(orderRequest, successResponse);
    });

    it('잔액 부족시 BadRequestException을 반환해야 한다', async () => {
      // Given
      const orderRequest = new OrderRequestDto(userId, buyLimitRequest);
      const noBalanceResponse = new OrderResponseDto(GrpcOrderStatusCode.NO_BALANCE, 'NONE');
      mockTransactionGrpcService.makeBuyOrder.mockReturnValue(of(noBalanceResponse));
      mockTransactionService.registerBuyOrder.mockRejectedValue(
        new BadRequestException('Not Enough Balance'),
      );

      // When & Then
      await expect(controller.buyLimitOrder(req, buyLimitRequest)).rejects.toThrow(
        new BadRequestException('Not Enough Balance'),
      );
      expect(grpcService.makeBuyOrder).toHaveBeenCalledWith(orderRequest);
    });

    it('트랜잭션 오류시 InternalServerErrorException을 반환해야 한다', async () => {
      // Given
      const orderRequest = new OrderRequestDto(userId, buyLimitRequest);
      const errorResponse = new OrderResponseDto(GrpcOrderStatusCode.TRANSACTION_ERROR, 'NONE');
      mockTransactionGrpcService.makeBuyOrder.mockReturnValue(of(errorResponse));
      mockTransactionService.registerBuyOrder.mockRejectedValue(
        new InternalServerErrorException('Internal Server Transaction Error'),
      );

      // When & Then
      await expect(controller.buyLimitOrder(req, buyLimitRequest)).rejects.toThrow(
        new InternalServerErrorException('Internal Server Transaction Error'),
      );
      expect(grpcService.makeBuyOrder).toHaveBeenCalledWith(orderRequest);
    });
  });

  describe('매도 주문', () => {
    const userId = '1';
    const sellLimitRequest: OrderLimitRequestDto = {
      coinCode: CurrencyCode.BTC,
      amount: 1,
      price: 50000,
    };
    const req = { user: { userId } };

    it('매도 주문이 성공적으로 처리되어야 한다', async () => {
      // Given
      const orderRequest = new OrderRequestDto(userId, sellLimitRequest);
      const successResponse = new OrderResponseDto(GrpcOrderStatusCode.SUCCESS, 'order-1');
      mockTransactionGrpcService.makeSellOrder.mockReturnValue(of(successResponse));

      // When
      await controller.sellLimitOrder(req, sellLimitRequest);

      // Then
      expect(grpcService.makeSellOrder).toHaveBeenCalledWith(orderRequest);
      expect(service.registerSellOrder).toHaveBeenCalledWith(orderRequest, successResponse);
    });

    it('자산 부족시 BadRequestException을 반환해야 한다', async () => {
      // Given
      const orderRequest = new OrderRequestDto(userId, sellLimitRequest);
      const noBalanceResponse = new OrderResponseDto(GrpcOrderStatusCode.NO_BALANCE, 'NONE');
      mockTransactionGrpcService.makeSellOrder.mockReturnValue(of(noBalanceResponse));
      mockTransactionService.registerSellOrder.mockRejectedValue(
        new BadRequestException('Not Enough Balance'),
      );

      // When & Then
      await expect(controller.sellLimitOrder(req, sellLimitRequest)).rejects.toThrow(
        new BadRequestException('Not Enough Balance'),
      );
      expect(grpcService.makeSellOrder).toHaveBeenCalledWith(orderRequest);
    });

    it('트랜잭션 오류시 InternalServerErrorException을 반환해야 한다', async () => {
      // Given
      const orderRequest = new OrderRequestDto(userId, sellLimitRequest);
      const errorResponse = new OrderResponseDto(GrpcOrderStatusCode.TRANSACTION_ERROR, 'NONE');
      mockTransactionGrpcService.makeSellOrder.mockReturnValue(of(errorResponse));
      mockTransactionService.registerSellOrder.mockRejectedValue(
        new InternalServerErrorException('Internal Server Transaction Error'),
      );

      // When & Then
      await expect(controller.sellLimitOrder(req, sellLimitRequest)).rejects.toThrow(
        new InternalServerErrorException('Internal Server Transaction Error'),
      );
      expect(grpcService.makeSellOrder).toHaveBeenCalledWith(orderRequest);
    });
  });
});
