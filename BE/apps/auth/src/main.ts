import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    legacyMode: false,
  });

  await redisClient.connect().catch(console.error);

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix: 'sid:',
      }),
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      name: 'sid',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  await app.listen(3000);
}
bootstrap();
