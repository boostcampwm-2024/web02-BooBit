import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { PrismaModule } from '@app/prisma';
import { BalanceRepository } from './balance.repository';
import { SessionModule } from '@app/session';
import { Transport } from '@nestjs/microservices';
import { CommonModule } from '@app/common';
import { BalanceProcessor } from './balance.processor';
import { BullMQModule } from '@app/bull';

@Module({
  imports: [PrismaModule, SessionModule, CommonModule, BullMQModule],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository, BalanceProcessor],
})
export class BalanceModule {
  static grpcOptions = {
    transport: Transport.GRPC,
    options: {
      package: ['order', 'account', 'trade'],
      protoPath: [
        'libs/grpc/proto/order.proto',
        'libs/grpc/proto/account.proto',
        'libs/grpc/proto/trade.proto',
      ],
      url: '0.0.0.0:50051',
    },
  };
}
