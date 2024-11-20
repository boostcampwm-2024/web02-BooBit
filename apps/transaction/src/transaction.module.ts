import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { PrismaModule } from '@app/prisma';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionOrderService } from './transaction.order.service';
import { SessionModule } from '@app/session';
import { CommonModule } from '@app/common';

@Module({
  imports: [
    PrismaModule,
    SessionModule,
    CommonModule,
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: 'libs/grpc/proto/order.proto',
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, TransactionOrderService],
})
export class TransactionModule {}
