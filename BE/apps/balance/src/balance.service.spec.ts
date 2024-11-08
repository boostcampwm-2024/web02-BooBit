import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceRepository } from './balance.repository';
import { CurrencyCode } from '@app/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('BalanceService', () => {
  let service: BalanceService;
  let repository: BalanceRepository;

  const mockBalanceRepository = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: BalanceRepository,
          useValue: mockBalanceRepository,
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    repository = module.get<BalanceRepository>(BalanceRepository);
    jest.clearAllMocks();
  });

  describe('deposit', () => {
    const userId = 'testuuid';
    const depositDto = {
      currency_code: CurrencyCode.KRW,
      amount: new Decimal(10000),
    };

    it('입금 금액이 0보다 작거나 같으면 에러를 반환해야 한다', async () => {
      const invalidDepositDto = { ...depositDto, amount: new Decimal(0) };
      await expect(service.deposit(userId, invalidDepositDto)).rejects.toThrow(BadRequestException);
    });

    it('입금이 성공적으로 처리되어야 한다', async () => {
      const mockResponse = {
        depositTransactionResult: {
          tx_id: 'testuuid',
          user_id: userId,
          currency_code: CurrencyCode.KRW,
          amount: new Decimal(10000),
        },
        newBalance: new Decimal(10000),
      };

      mockBalanceRepository.deposit.mockResolvedValue(mockResponse);

      const result = await service.deposit(userId, depositDto);

      expect(repository.deposit).toHaveBeenCalledWith(userId, depositDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('withdraw', () => {
    const userId = 'testuuid';
    const withdrawDto = {
      currency_code: CurrencyCode.KRW,
      amount: new Decimal(5000),
    };

    it('출금 금액이 0보다 작거나 같으면 에러를 반환해야 한다', async () => {
      const invalidWithdrawDto = { ...withdrawDto, amount: new Decimal(0) };
      await expect(service.withdraw(userId, invalidWithdrawDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('출금이 성공적으로 처리되어야 한다', async () => {
      const mockResponse = {
        makeHistoryResult: {
          tx_id: 'testuuid',
          user_id: userId,
          currency_code: CurrencyCode.KRW,
          amount: new Decimal(5000),
        },
        newBalance: new Decimal(5000),
      };

      mockBalanceRepository.withdraw.mockResolvedValue(mockResponse);

      const result = await service.withdraw(userId, withdrawDto);

      expect(repository.withdraw).toHaveBeenCalledWith(userId, withdrawDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('자산 목록 조회', () => {
    it('자산 목록 조회에 성공한다.', async () => {
      const mockAssets = [
        {
          currency_code: 'KRW',
          available_balance: new Decimal(100),
          locked_balance: new Decimal(50),
          currency: { name: '원화' },
        },
        {
          currency_code: 'BTC',
          available_balance: new Decimal(200),
          locked_balance: new Decimal(30),
          currency: { name: '비트코인' },
        },
      ];
      balanceRepository.getAssets = jest.fn().mockResolvedValue(mockAssets);

      const result = await balanceService.getAssets(1);

      expect(result).toEqual([
        new AssetDto('KRW', '원화', new Decimal(100), new Decimal(50)),
        new AssetDto('BTC', '비트코인', new Decimal(200), new Decimal(30)),
      ]);
      expect(balanceRepository.getAssets).toHaveBeenCalledWith(1);
    });

    it('자산 목록이 없으면 BalanceException이 발생한다.', async () => {
      balanceRepository.getAssets = jest.fn().mockResolvedValue([]);

      await expect(balanceService.getAssets(1)).rejects.toThrow(BalanceException);
      await expect(balanceService.getAssets(1)).rejects.toThrow(
        BALANCE_EXCEPTIONS.USER_ASSETS_NOT_FOUND.message,
      );
      expect(balanceRepository.getAssets).toHaveBeenCalledWith(1);
    });
  });
});
