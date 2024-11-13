// src/session/session.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session'; // import 수정
import RedisStore from 'connect-redis'; // import 수정
import { Redis } from 'ioredis';
import * as passport from 'passport';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly redisClient: Redis;
  private readonly sessionMiddleware: any;

  constructor() {
    // Redis 클라이언트 초기화
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      keepAlive: 10000,
    });
    this.redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    // RedisStore 인스턴스 생성
    const redisStore = new RedisStore({
      client: this.redisClient,
      prefix: 'sid', // 선택적: 세션 키 접두사
    });

    // 세션 미들웨어 설정
    this.sessionMiddleware = session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24시간
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // 세션 미들웨어 적용
    this.sessionMiddleware(req, res, () => {
      // Passport 초기화
      passport.initialize()(req, res, () => {
        passport.session()(req, res, next);
      });
    });
  }
}
