import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { PrismaModule } from '@app/prisma';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionOrderService } from './transaction.order.service';
import { SessionModule } from '@app/session';
import { WsModule } from '@app/ws/ws.module';
import { TransactionWsGateway } from './gateway/transaction.ws.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '@app/common';
import { TransactionWsService } from './gateway/transaction.ws.service';
import { BullMQModule } from '@app/bull';
import { TransactionQueueService } from './transaction.queue.service';

@Module({
  imports: [
    PrismaModule,
    SessionModule,
    WsModule,
    CommonModule,
    BullMQModule,
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
    TransactionWsGateway,
    TransactionWsService,
    TransactionQueueService,
  ],
})
export class TransactionModule {}
