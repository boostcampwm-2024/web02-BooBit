// src/session/session.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SessionMiddleware } from './session.middleware';
import { SessionSerializer } from './passport/session.serializer';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [SessionSerializer, AuthenticatedGuard],
  exports: [SessionSerializer, AuthenticatedGuard],
})
export class SessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*'); // 모든 라우트에 적용
  }
}
