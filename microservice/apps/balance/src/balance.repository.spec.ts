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
    const userId = BigInt(1);
    const depositDto = {
      currencyCode: CurrencyCode.KRW,
      amount: 10000,
    };

    it('새로운 자산을 생성하고 입금이 성공적으로 처리되어야 한다', async () => {
      const mockAsset = {
        userId: userId,
        currencyCode: CurrencyCode.KRW,
        availableBalance: 10000,
        lockedBalance: 0,
      };

      const mockTransaction = {
        txId: 'testuuid',
        userId: userId,
        currencyCode: CurrencyCode.KRW,
        txType: TransactionType.DEPOSIT,
        amount: 10000,
      };

      mockPrismaService.asset.upsert.mockResolvedValue(mockAsset);
      mockPrismaService.depositWithdrawal.create.mockResolvedValue(mockTransaction);

      const result = await repository.deposit(userId, depositDto);

      expect(mockPrismaService.asset.upsert).toHaveBeenCalledWith({
        where: {
          userId_currencyCode: {
            userId: userId,
            currencyCode: CurrencyCode.KRW,
          },
        },
        create: {
          userId: userId,
          currencyCode: CurrencyCode.KRW,
          availableBalance: 10000,
          lockedBalance: 0,
        },
        update: {
          availableBalance: {
            increment: 10000,
          },
        },
      });

      expect(result).toEqual({
        depositTransactionResult: mockTransaction,
        newBalance: mockAsset.availableBalance,
      });
    });
  });

  describe('withdraw', () => {
    const userId = BigInt(1);
    const withdrawDto = {
      currencyCode: CurrencyCode.KRW,
      amount: 5000,
    };

    it('자산이 존재하지 않는 경우 에러를 반환해야 한다', async () => {
      mockPrismaService.asset.findUnique.mockResolvedValue(null);

      await expect(repository.withdraw(userId, withdrawDto)).rejects.toThrow(BadRequestException);
    });

    it('잔액이 부족한 경우 에러를 반환해야 한다', async () => {
      mockPrismaService.asset.findUnique.mockResolvedValue({
        availableBalance: new Decimal(1000),
      });

      await expect(repository.withdraw(userId, withdrawDto)).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.asset.update).not.toHaveBeenCalled();
      expect(mockPrismaService.depositWithdrawal.create).not.toHaveBeenCalled();
    });

    it('출금이 성공적으로 처리��어야 한다', async () => {
      const mockAsset = {
        userId: userId,
        currencyCode: CurrencyCode.KRW,
        availableBalance: new Decimal(10000),
        lockedBalance: 0,
      };

      const mockUpdatedAsset = {
        ...mockAsset,
        availableBalance: new Decimal(5000),
      };

      const mockTransaction = {
        txId: 'testuuid',
        userId: userId,
        currencyCode: CurrencyCode.KRW,
        txType: TransactionType.WITHDRAWAL,
        amount: 5000,
      };

      mockPrismaService.asset.findUnique.mockResolvedValue(mockAsset);
      mockPrismaService.asset.update.mockResolvedValue(mockUpdatedAsset);
      mockPrismaService.depositWithdrawal.create.mockResolvedValue(mockTransaction);

      const result = await repository.withdraw(userId, withdrawDto);

      expect(mockPrismaService.asset.update).toHaveBeenCalledWith({
        where: {
          userId_currencyCode: {
            userId,
            currencyCode: CurrencyCode.KRW,
          },
        },
        data: {
          availableBalance: {
            decrement: withdrawDto.amount,
          },
        },
      });

      expect(mockPrismaService.depositWithdrawal.create).toHaveBeenCalledWith({
        data: {
          userId,
          currencyCode: withdrawDto.currencyCode,
          txType: TransactionType.WITHDRAWAL,
          amount: withdrawDto.amount,
        },
      });

      expect(result).toEqual({
        makeHistoryResult: mockTransaction,
        newBalance: mockUpdatedAsset.availableBalance,
      });
    });
  });
});
