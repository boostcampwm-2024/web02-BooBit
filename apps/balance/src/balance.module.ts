import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { PrismaModule } from '@app/prisma';
import { BalanceRepository } from './balance.repository';
import { SessionModule } from '@app/session';
import { Transport } from '@nestjs/microservices';

@Module({
  imports: [PrismaModule, SessionModule],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository],
})
export class BalanceModule {
  static grpcOptions = {
    transport: Transport.GRPC,
    options: {
      package: ['order', 'account'],
      protoPath: ['libs/grpc/src/order.proto', 'libs/grpc/src/account.proto'],
      url: '0.0.0.0:5001',
    },
  };
}
