import * as session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import * as crypto from 'crypto';
import * as passport from 'passport';

export const createSessionConfig = async () => {
  const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    legacyMode: false,
  });

  await redisClient.connect().catch(console.error);

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
