import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { PrismaModule } from '@app/prisma';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionOrderService } from './transaction.order.service';
import { SessionModule } from '@app/session';
import { WsModule } from '@app/ws/ws.module';
import { CandleGateway } from './gateway/transaction.candle.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '@app/common';
import { CandleService } from './gateway/transaction.candle.service';

@Module({
  imports: [
    PrismaModule,
    SessionModule,
    WsModule,
    CommonModule,
    ClientsModule.registerAsync([
      {
        name: 'ORDER_PACKAGE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'order',
            protoPath: 'libs/grpc/proto/order.proto',
            url: `${configService.get('BALANCE_GRPC_URL')}`,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepository,
    TransactionOrderService,
    CandleGateway,
    CandleService,
  ],
})
export class TransactionModule {}
