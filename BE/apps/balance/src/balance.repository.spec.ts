import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { BalanceRepository, TransactionType } from './balance.repository';
import { CurrencyCode } from '@app/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('BalanceRepository', () => {
  let repository: BalanceRepository;

  const mockPrismaService = {
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
    asset: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    depositWithdrawal: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<BalanceRepository>(BalanceRepository);
    jest.clearAllMocks();
  });

  describe('deposit', () => {
    const userId = 'testuuid';
    const depositDto = {
      currency_code: CurrencyCode.KRW,
      amount: new Decimal(10000),
    };

    it('새로운 자산을 생성하고 입금이 성공적으로 처리되어야 한다', async () => {
      const mockAsset = {
        user_id: userId,
        currency_code: CurrencyCode.KRW,
        available_balance: new Decimal(10000),
        locked_balance: new Decimal(0),
      };

      const mockTransaction = {
        tx_id: 'testuuid',
        user_id: userId,
        currency_code: CurrencyCode.KRW,
        tx_type: TransactionType.DEPOSIT,
        amount: new Decimal(10000),
      };

      mockPrismaService.asset.upsert.mockResolvedValue(mockAsset);
      mockPrismaService.depositWithdrawal.create.mockResolvedValue(mockTransaction);

      const result = await repository.deposit(userId, depositDto);

      expect(mockPrismaService.asset.upsert).toHaveBeenCalledWith({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: CurrencyCode.KRW,
          },
        },
        create: {
          user_id: userId,
          currency_code: CurrencyCode.KRW,
          available_balance: new Decimal(10000),
          locked_balance: new Decimal(0),
        },
        update: {
          available_balance: {
            increment: new Decimal(10000),
          },
        },
      });

      expect(result).toEqual({
        depositTransactionResult: mockTransaction,
        newBalance: mockAsset.available_balance,
      });
    });
  });

  describe('withdraw', () => {
    const userId = 'testuuid';
    const withdrawDto = {
      currency_code: CurrencyCode.KRW,
      amount: new Decimal(5000),
    };

    it('잔액이 부족한 경우 에러를 반환해야 한다', async () => {
      mockPrismaService.asset.findUnique.mockResolvedValue({
        available_balance: new Decimal(1000),
      });

      await expect(repository.withdraw(userId, withdrawDto)).rejects.toThrow(BadRequestException);
    });

    it('출금이 성공적으로 처리되어야 한다', async () => {
      const mockAsset = {
        user_id: userId,
        currency_code: CurrencyCode.KRW,
        available_balance: new Decimal(10000),
        locked_balance: new Decimal(0),
      };

      const mockUpdatedAsset = {
        ...mockAsset,
        available_balance: new Decimal(5000),
      };

      const mockTransaction = {
        tx_id: 'testuuid',
        user_id: userId,
        currency_code: CurrencyCode.KRW,
        tx_type: TransactionType.WITHDRAWAL,
        amount: new Decimal(5000),
      };

      mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset);
      mockPrismaService.asset.update.mockResolvedValue(mockUpdatedAsset);
      mockPrismaService.depositWithdrawal.create.mockResolvedValue(mockTransaction);

      const result = await repository.withdraw(userId, withdrawDto);

      expect(result).toEqual({
        makeHistoryResult: mockTransaction,
        newBalance: mockUpdatedAsset.available_balance,
      });
    });
  });
});
