import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { PrismaModule } from '@app/prisma';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionOrderService } from './transaction.order.service';
import { SessionModule } from '@app/session';

@Module({
  imports: [
    PrismaModule,
    SessionModule,
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: 'libs/grpc/src/order.proto',
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, TransactionOrderService],
})
export class TransactionModule {}
