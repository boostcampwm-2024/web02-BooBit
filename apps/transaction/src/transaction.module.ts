import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { SessionSerializer } from '@app/common/session/session.serializer';
import { PrismaModule } from '@app/prisma';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionGrcpService } from './transaction.grcp.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ session: true }),
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: '@app/grpc/order.proto',
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, SessionSerializer, TransactionGrcpService],
})
export class TransactionModule {}
