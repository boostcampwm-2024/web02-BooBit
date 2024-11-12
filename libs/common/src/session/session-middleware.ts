import * as session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import * as crypto from 'crypto';
import * as passport from 'passport';

export const createSessionConfig = async () => {
  const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      keepAlive: 10000,
      timeout: 0,
      reconnectStrategy: (retries) => {
        // 자동 재연결 시도 횟수가 10을 넘으면 중단합니다.
        console.log('재연결 시도');
        if (retries > 10) {
          console.log('Redis 재연결 시도 중단');
          return new Error('Redis 서버에 연결할 수 없습니다.');
        }
        // 재연결 시도 전 대기 시간 설정 (100ms * 시도 횟수, 최대 3000ms)
        return Math.min(retries * 100, 3000);
      },
    },
  });
  const sendKeepAlivePing = () => {
    redisClient
      .ping()
      .then(() => console.log(`[${new Date().toLocaleString()}] Keep-Alive: PING sent to Redis`))
      .catch((err) => console.error(`[${new Date().toLocaleString()}] Redis PING error:`, err));
  };
  // 연결 성공 시 시간 기록
  redisClient.on('connect', () => {
    console.log(`[${new Date().toLocaleString()}] Redis 연결 성공`);
  });

  // 재연결 시도 시 시간 기록
  redisClient.on('reconnecting', () => {
    console.log(`[${new Date().toLocaleString()}] Redis 재연결 중`);
  });

  // 연결 종료 시 시간 기록
  redisClient.on('end', () => {
    console.log(`[${new Date().toLocaleString()}] Redis 연결 종료`);
  });

  // 에러 발생 시 에러와 시간 기록
  redisClient.on('error', (err) => {
    console.error(`[${new Date().toLocaleString()}] Redis 클라이언트 에러`, err);
  });

  await redisClient
    .connect()
    .then(() => {
      setInterval(sendKeepAlivePing, 10000);
    })
    .catch(console.error);

  const sessionMiddleware = session({
    store: new RedisStore({
      client: redisClient,
      prefix: 'sid:',
    }),
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    name: 'sid',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'strict',
    },
  });

  return {
    session: sessionMiddleware,
    passportInitialize: passport.initialize(),
    passportSession: passport.session(),
    redisClient,
  };
};
