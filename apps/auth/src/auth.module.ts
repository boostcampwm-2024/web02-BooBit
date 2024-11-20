import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport/local.strategy';
import { PrismaModule } from '@app/prisma';
import { LocalAuthGuard } from './passport/local.auth.guard';
import { SessionModule } from '@app/session';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonModule } from '@app/common';

@Module({
  imports: [
    PrismaModule,
    SessionModule,
    CommonModule,
    ClientsModule.register([
      {
        name: 'ACCOUNT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'account',
          protoPath: 'libs/grpc/proto/account.proto',
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
})
export class AuthModule {}
