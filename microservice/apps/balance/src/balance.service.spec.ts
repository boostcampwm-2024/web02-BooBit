import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { BalanceRepository } from './balance.repository';
import { CurrencyCode } from '@app/common';
import { Decimal } from '@prisma/client/runtime/library';
import { BalanceException } from './exception/balance.exception';
import { AssetDto } from './dto/asset.dto';
import { GetTransactionsDto } from './dto/get.transactions.request.dto';

describe('BalanceService', () => {
  let service: BalanceService;
  let repository: BalanceRepository;

  const mockBalanceRepository = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    getAssets: jest.fn(),
    getBankHistory: jest.fn(),
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
      currencyCode: CurrencyCode.KRW,
      amount: 10000,
    };

    it('입금 금액이 0보다 작거나 같으면 에러를 반환해야 한다', async () => {
      const invalidDepositDto = { ...depositDto, amount: 0 };
      await expect(service.deposit(userId, invalidDepositDto)).rejects.toThrow(BalanceException);
    });

    it('입금이 성공적으로 처리되어야 한다', async () => {
      mockBalanceRepository.deposit.mockResolvedValue(true);
      const result = await service.deposit(userId, depositDto);
      expect(repository.deposit).toHaveBeenCalledWith(userId, depositDto);
      expect(result).toBe(true);
    });
  });

  describe('withdraw', () => {
    const userId = BigInt(1);
    const withdrawDto = {
      currencyCode: CurrencyCode.KRW,
      amount: 5000,
    };

    it('출금 금액이 0보다 작거나 같으면 에러를 반환해야 한다', async () => {
      const invalidWithdrawDto = { ...withdrawDto, amount: 0 };
      await expect(service.withdraw(userId, invalidWithdrawDto)).rejects.toThrow(BalanceException);
    });

    it('출금이 성공적으로 처리되어야 한다', async () => {
      mockBalanceRepository.withdraw.mockResolvedValue(true);
      const result = await service.withdraw(userId, withdrawDto);
      expect(repository.withdraw).toHaveBeenCalledWith(userId, withdrawDto);
      expect(result).toBe(true);
    });
  });

  describe('getAssets', () => {
    const userId = BigInt(1);

    it('사용자의 자산이 없으면 에러를 반환해야 한다', async () => {
      mockBalanceRepository.getAssets.mockResolvedValue([]);

      await expect(service.getAssets(userId)).rejects.toThrow(BalanceException);
    });

    it('사용자의 자산이 성공적으로 반환되어야 한다', async () => {
      const mockAssets = [
        {
          currencyCode: CurrencyCode.KRW,
          availableBalance: new Decimal(10000),
          lockedBalance: new Decimal(0),
        },
      ];

      const expectedAssets = mockAssets.map(
        (asset) =>
          new AssetDto(
            asset.currencyCode,
            asset.availableBalance.add(asset.lockedBalance).toNumber(),
          ),
      );

      mockBalanceRepository.getAssets.mockResolvedValue(mockAssets);

      const result = await service.getAssets(userId);

      expect(repository.getAssets).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedAssets);
    });
  });
  describe('getTransactions', () => {
    const userId = BigInt(1);
    const dto: GetTransactionsDto = {
      currencyCode: 'BTC',
      id: null,
    };

    const mockRepositoryResponse = {
      items: [
        {
          txId: BigInt(1000),
          txType: 'DEPOSIT',
          currencyCode: 'BTC',
          amount: new Decimal(1.5),
          createdAt: new Date('2024-01-20T09:30:00.000Z'),
        },
        {
          txId: BigInt(999),
          txType: 'WITHDRAWAL',
          currencyCode: 'BTC',
          amount: new Decimal(0.5),
          createdAt: new Date('2024-01-20T08:30:00.000Z'),
        },
      ],
      nextId: 998,
    };

    const expectedResponse = {
      nextId: 998,
      transactions: [
        {
          tx_type: 'deposit',
          amount: 1.5,
          currency_code: 'BTC',
          timestamp: '2024-01-20T09:30:00.000Z',
        },
        {
          tx_type: 'withdrawal',
          amount: 0.5,
          currency_code: 'BTC',
          timestamp: '2024-01-20T08:30:00.000Z',
        },
      ],
    };

    it('거래내역을 정상적으로 변환하여 반환해야 한다', async () => {
      // Given
      mockBalanceRepository.getBankHistory.mockResolvedValue(mockRepositoryResponse);

      // When
      const result = await service.getTransactions(userId, dto);

      // Then
      expect(result).toEqual(expectedResponse);
      expect(repository.getBankHistory).toHaveBeenCalledWith(userId, dto);
    });

    it('거래내역이 없을 경우 빈 배열을 반환해야 한다', async () => {
      // Given
      mockBalanceRepository.getBankHistory.mockResolvedValue({
        items: [],
        nextId: null,
      });

      // When
      const result = await service.getTransactions(userId, dto);

      // Then
      expect(result).toEqual({
        nextId: null,
        transactions: [],
      });
    });

    it('거래내역의 타입과 시간 형식을 올바르게 변환해야 한다', async () => {
      // Given
      const singleTxResponse = {
        items: [
          {
            txId: BigInt(1000),
            txType: 'DEPOSIT',
            currencyCode: 'BTC',
            amount: new Decimal(1.5),
            createdAt: new Date('2024-01-20T09:30:00.000Z'),
          },
        ],
        nextId: null,
      };

      mockBalanceRepository.getBankHistory.mockResolvedValue(singleTxResponse);

      // When
      const result = await service.getTransactions(userId, dto);

      // Then
      expect(result.transactions[0]).toEqual({
        tx_type: 'deposit',
        amount: 1.5,
        currency_code: 'BTC',
        timestamp: '2024-01-20T09:30:00.000Z',
      });
    });

    it('Decimal 타입의 금액을 number 타입으로 정확하게 변환해야 한다', async () => {
      // Given
      const preciseAmountTx = {
        items: [
          {
            txId: BigInt(1000),
            txType: 'DEPOSIT',
            currencyCode: 'BTC',
            amount: new Decimal('1.12345678'),
            createdAt: new Date('2024-01-20T09:30:00.000Z'),
          },
        ],
        nextId: null,
      };

      mockBalanceRepository.getBankHistory.mockResolvedValue(preciseAmountTx);

      // When
      const result = await service.getTransactions(userId, dto);

      // Then
      expect(typeof result.transactions[0].amount).toBe('number');
      expect(result.transactions[0].amount).toBe(1.12345678);
    });
  });
});
