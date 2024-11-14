import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { CurrencyCode, CurrencyCodeName } from '@app/common';
import { CreateTransactionDto } from './dto/create.transaction.dto';

describe('BalanceController', () => {
  let controller: BalanceController;
  let service: BalanceService;

  const mockRequest = {
    user: {
      userId: 'test-user-id',
    },
  };

  const mockBalanceService = {
    getAssets: jest.fn(),
    deposit: jest.fn(),
    withdraw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceController,
        {
          provide: BalanceService,
          useValue: mockBalanceService,
        },
      ],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
    service = module.get<BalanceService>(BalanceService);
    jest.clearAllMocks();
  });

  describe('자산 목록 조회', () => {
    it('자산 목록 조회에 성공한다.', async () => {
      const mockAssets = [
        {
          currencyCode: CurrencyCode.KRW,
          name: CurrencyCodeName[CurrencyCode.KRW],
          amount: 150,
        },
      ];

      service.getAssets = jest.fn().mockResolvedValue(mockAssets);

      const response = await controller.getAssets(mockRequest);

      expect(response.assets).toEqual(mockAssets);
      expect(service.getAssets).toHaveBeenCalledWith(mockRequest.user.userId);
    });
  });

  describe('입금', () => {
    it('입금에 성공한다.', async () => {
      const createTransactionDto: CreateTransactionDto = {
        currencyCode: CurrencyCode.KRW,
        amount: 1000,
      };

      await controller.deposit(createTransactionDto, mockRequest);

      expect(service.deposit).toHaveBeenCalledWith(mockRequest.user.userId, createTransactionDto);
    });
  });

  describe('출금', () => {
    it('출금에 성공한다.', async () => {
      const createTransactionDto: CreateTransactionDto = {
        currencyCode: CurrencyCode.KRW,
        amount: 1000,
      };

      await controller.withdraw(createTransactionDto, mockRequest);

      expect(service.withdraw).toHaveBeenCalledWith(mockRequest.user.userId, createTransactionDto);
    });
  });
});
