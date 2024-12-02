import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { BullMQModule } from '@app/bull';
import { TradeProcessor } from './trade.processor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TradeRepository } from './trade.repository';
import { TradeBalanceService } from './trade.balance.service';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    PrismaModule,
    BullMQModule,
    ClientsModule.registerAsync([
      {
        name: 'TRADE_PACKAGE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'trade',
            protoPath: 'libs/grpc/proto/trade.proto',
            url: `${configService.get('BALANCE_GRPC_URL')}`,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [TradeService, TradeProcessor, TradeBalanceService, TradeRepository],
})
export class TradeModule {}
