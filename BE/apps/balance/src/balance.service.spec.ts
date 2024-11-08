import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceRepository } from './balance.repository';
import { CurrencyCode } from '@app/common';
import { Decimal } from '@prisma/client/runtime/library';
import { BalanceException } from './exception/balance.exception';
import { BALANCE_EXCEPTIONS } from './exception/balance.exceptions';
import { AssetDto } from './dto/asset.dto';

describe('BalanceService', () => {
  let service: BalanceService;
  let repository: BalanceRepository;

  const mockBalanceRepository = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    getAssets: jest.fn(),
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
    const userId = BigInt(1);
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
    const userId = BigInt(1);
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

  describe('getAssets', () => {
    const userId = 1;

    it('사용자의 자산이 없으면 에러를 반환해야 한다', async () => {
      mockBalanceRepository.getAssets.mockResolvedValue([]);

      await expect(service.getAssets(userId)).rejects.toThrow(BalanceException);
      await expect(service.getAssets(userId)).rejects.toThrowError(
        new BalanceException(BALANCE_EXCEPTIONS.USER_ASSETS_NOT_FOUND),
      );
    });

    it('사용자의 자산이 성공적으로 반환되어야 한다', async () => {
      const mockAssets = [
        {
          currency_code: CurrencyCode.KRW,
          available_balance: new Decimal(10000),
          locked_balance: new Decimal(0),
        },
      ];

      const expectedAssets = mockAssets.map(
        (asset) => new AssetDto(asset.currency_code, asset.available_balance, asset.locked_balance),
      );

      mockBalanceRepository.getAssets.mockResolvedValue(mockAssets);

      const result = await service.getAssets(userId);

      expect(repository.getAssets).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedAssets);
    });
  });
});
