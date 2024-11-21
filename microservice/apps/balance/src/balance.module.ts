import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { PrismaModule } from '@app/prisma';
import { BalanceRepository } from './balance.repository';
import { SessionModule } from '@app/session';
import { Transport } from '@nestjs/microservices';
import { CommonModule } from '@app/common';

@Module({
  imports: [PrismaModule, SessionModule, CommonModule],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository],
})
export class BalanceModule {
  static grpcOptions = {
    transport: Transport.GRPC,
    options: {
      package: ['order', 'account'],
      protoPath: ['libs/grpc/proto/order.proto', 'libs/grpc/proto/account.proto'],
      url: '0.0.0.0:50051',
    },
  };
}
