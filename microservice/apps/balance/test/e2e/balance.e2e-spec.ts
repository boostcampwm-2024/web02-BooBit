import { Test, TestingModule } from '@nestjs/testing';
import { BalanceModule } from '../../src/balance.module';
import { BalanceService, TransactionType } from '../../src/balance.service';
import { PrismaModule, PrismaService } from '@app/prisma';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { CurrencyCode } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { execSync } from 'child_process';
import { resolve } from 'path';

describe('BalanceService E2E Test', () => {
  let app: INestApplication;
  let service: BalanceService;
  let prisma: PrismaService;
  const envPath = resolve(__dirname, '../../.env.test');
  const testSchemaPath = resolve(__dirname, '../../prisma/schema.sqlite.prisma');
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: envPath,
        }),
        PrismaModule,
        BalanceModule,
      ],
    }).compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<BalanceService>(BalanceService);
    
    // DB 마이그레이션
    try {
      
      // migration 파일 생성 (개발 환경에서만 필요// 맨첨에만 필요)
      execSync(`npx prisma migrate dev --name init --schema ${testSchemaPath}`,{
        env: {
          ...process.env
        }
      });
      
      execSync(`npx prisma migrate deploy --schema ${testSchemaPath}`,{
        env: {
          ...process.env
        }
      });

    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }

    await app.init();
  });

  
  beforeEach(async () => {
    await prisma.$transaction([
      prisma.depositWithdrawal.deleteMany(),
      prisma.asset.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('deposit (입금 테스트)', () => {
    const userId = "testuuid";
    const currency = CurrencyCode.KRW;

    it('신규 사용자의 첫 입금이 성공적으로 처리되어야 한다', async () => {
      const depositAmount = new Decimal(10000);

      const result = await service.deposit(userId, {
        currency_code: currency,
        amount: depositAmount,
      });

      // Asset 테이블 확인
      const asset = await prisma.asset.findUnique({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: currency,
          },
        },
      });

      expect(asset).toBeDefined();
      expect(asset.available_balance.toString()).toBe(depositAmount.toString());
      expect(asset.locked_balance.toString()).toBe('0');

      // DepositWithdrawal 테이블 확인
      const transaction = await prisma.depositWithdrawal.findFirst({
        where: {
          user_id: userId,
          currency_code: currency,
          tx_type: TransactionType.DEPOSIT,
        },
      });

      expect(transaction).toBeDefined();
      expect(transaction.amount.toString()).toBe(depositAmount.toString());

      // 반환값 확인
      expect(result.newBalance.toString()).toBe(depositAmount.toString());
      expect(result.depositTransaction.amount.toString()).toBe(depositAmount.toString());
    });

    it('기존 사용자의 추가 입금이 잔액에 정확히 반영되어야 한다', async () => {
      // 첫 입금
      await service.deposit(userId, {
        currency_code: currency,
        amount: new Decimal(10000),
      });

      // 추가 입금
      const additionalAmount = new Decimal(5000);
      const result = await service.deposit(userId, {
        currency_code: currency,
        amount: additionalAmount,
      });

      // 잔액 확인
      const asset = await prisma.asset.findUnique({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: currency,
          },
        },
      });

      expect(asset.available_balance.toString()).toBe('15000');

      // 거래 기록 확인
      const transactions = await prisma.depositWithdrawal.findMany({
        where: {
          user_id: userId,
          currency_code: currency,
          tx_type: TransactionType.DEPOSIT,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      expect(transactions).toHaveLength(2);
      expect(transactions[0].amount.toString()).toBe(additionalAmount.toString());
    });

    it('입금 금액이 0 이하인 경우 에러가 발생해야 한다', async () => {
      await expect(
        service.deposit(userId, {
          currency_code: currency,
          amount: new Decimal(0),
        })
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.deposit(userId, {
          currency_code: currency,
          amount: new Decimal(-1000),
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('withdraw (출금 테스트)', () => {
    const userId = "testuuid";
    const currency = CurrencyCode.KRW;
    const initialBalance = new Decimal(20000);

    beforeEach(async () => {
      // 각 출금 테스트 전에 초기 잔액을 설정합니다
      await service.deposit(userId, {
        currency_code: currency,
        amount: initialBalance,
      });
    });

    it('잔액 범위 내에서 출금이 성공적으로 처리되어야 한다', async () => {
      const withdrawAmount = new Decimal(15000);

      const result = await service.withdraw(userId, {
        currency_code: currency,
        amount: withdrawAmount,
      });

      // 잔액 확인
      const asset = await prisma.asset.findUnique({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: currency,
          },
        },
      });

      expect(asset.available_balance.toString()).toBe('5000');

      // 출금 거래 기록 확인
      const withdrawal = await prisma.depositWithdrawal.findFirst({
        where: {
          user_id: userId,
          currency_code: currency,
          tx_type: TransactionType.WITHDRAWAL,
        },
      });

      expect(withdrawal).toBeDefined();
      expect(withdrawal.amount.toString()).toBe(withdrawAmount.toString());

      // 반환값 확인
      expect(result.newBalance.toString()).toBe('5000');
      expect(result.transaction.amount.toString()).toBe(withdrawAmount.toString());
    });

    it('잔액을 초과하는 출금 요청시 에러가 발생해야 한다', async () => {
      const excessiveAmount = new Decimal(25000);

      await expect(
        service.withdraw(userId, {
          currency_code: currency,
          amount: excessiveAmount,
        })
      ).rejects.toThrow(BadRequestException);

      // 잔액이 변경되지 않았는지 확인
      const asset = await prisma.asset.findUnique({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: currency,
          },
        },
      });

      expect(asset.available_balance.toString()).toBe(initialBalance.toString());
    });

    it('출금 금액이 0 이하인 경우 에러가 발생해야 한다', async () => {
      await expect(
        service.withdraw(userId, {
          currency_code: currency,
          amount: new Decimal(0),
        })
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.withdraw(userId, {
          currency_code: currency,
          amount: new Decimal(-1000),
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('여러 번의 출금 후 잔액이 정확히 계산되어야 한다', async () => {
      // 첫 번째 출금
      await service.withdraw(userId, {
        currency_code: currency,
        amount: new Decimal(5000),
      });

      // 두 번째 출금
      await service.withdraw(userId, {
        currency_code: currency,
        amount: new Decimal(3000),
      });

      // 최종 잔액 확인
      const asset = await prisma.asset.findUnique({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: currency,
          },
        },
      });

      expect(asset.available_balance.toString()).toBe('12000'); // 20000 - 5000 - 3000

      // 출금 거래 기록들 확인
      const withdrawals = await prisma.depositWithdrawal.findMany({
        where: {
          user_id: userId,
          currency_code: currency,
          tx_type: TransactionType.WITHDRAWAL,
        },
        orderBy: {
          created_at: 'asc',
        },
      });

      expect(withdrawals).toHaveLength(2);
      expect(withdrawals[0].amount.toString()).toBe('5000');
      expect(withdrawals[1].amount.toString()).toBe('3000');
    });
  });

  describe('동시성 테스트', () => {
    const userId = "testuuid";
    const currency = CurrencyCode.KRW;
    const initialBalance = new Decimal(10000);

    beforeEach(async () => {
      await service.deposit(userId, {
        currency_code: currency,
        amount: initialBalance,
      });
    });

    it('동시에 여러 출금 요청이 발생해도 잔액이 정확히 처리되어야 한다', async () => {
      const withdrawAmount = new Decimal(3000);
      const withdrawPromises = Array(3).fill(null).map(() =>
        service.withdraw(userId, {
          currency_code: currency,
          amount: withdrawAmount,
        })
      );

      await Promise.all(withdrawPromises);

      const asset = await prisma.asset.findUnique({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code: currency,
          },
        },
      });

      expect(asset.available_balance.toString()).toBe('1000'); // 10000 - (3000 * 3)

      // 출금 거래 기록 확인
      const withdrawals = await prisma.depositWithdrawal.findMany({
        where: {
          user_id: userId,
          currency_code: currency,
          tx_type: TransactionType.WITHDRAWAL,
        },
      });

      expect(withdrawals).toHaveLength(3);
      withdrawals.forEach(withdrawal => {
        expect(withdrawal.amount.toString()).toBe(withdrawAmount.toString());
      });
    });
  });
});