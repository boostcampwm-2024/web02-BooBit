// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    // Prisma 클라이언트 초기화 시 로그 레벨 설정
    super({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL')
        },
      },
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to database...');
      await this.$connect();
      this.logger.log('Successfully connected to database');

      // 데이터베이스 연결 테스트를 위한 쿼리 실행
      await this.$queryRaw`SELECT 1`;
      this.logger.log('Database connection test successful');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }

    // 쿼리 실행 시 로그를 남기기 위한 미들웨어 설정
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      this.logger.debug(`Query ${params.model}.${params.action} took ${after - before}ms`);
      return result;
    });
  }

  async onModuleDestroy() {
    try {
      this.logger.log('Disconnecting from database...');
      await this.$disconnect();
      this.logger.log('Successfully disconnected from database');
    } catch (error) {
      this.logger.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  // 트랜잭션 헬퍼 메소드
  async executeInTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      return await fn(tx);
    });
  }
}