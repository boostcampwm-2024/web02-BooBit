import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from '@app/common/session/session.serializer';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { PrismaModule } from '@app/prisma';
import { BalanceRepository } from './balance.repository';

@Module({
  imports: [PrismaModule, PassportModule.register({ session: true })],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository, SessionSerializer],
})
export class BalanceModule {}
