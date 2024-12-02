import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('TRADE_REDIS_URL'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          attempts: 3,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'trade',
    }),
  ],
  exports: [BullModule],
})
export class BullMQModule {}
