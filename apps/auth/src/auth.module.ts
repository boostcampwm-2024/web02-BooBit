import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport/local.strategy';
import { PrismaModule } from '@app/prisma';
import { LocalAuthGuard } from './passport/local.auth.guard';
import { SessionModule } from '@app/session';
import { CommonModule } from '@app/common';

@Module({
  imports: [PrismaModule, SessionModule, CommonModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
})
export class AuthModule {}
