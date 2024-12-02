import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    const sessionUser = {
      user_id: user.userId,
      email: user.email,
      name: user.name,
    };
    done(null, sessionUser);
  }

  deserializeUser(sessionUser: any, done: (err: Error, payload: any) => void) {
    const user = {
      userId: sessionUser.user_id,
      email: sessionUser.email,
      name: sessionUser.name,
    };
    done(null, user);
  }
}
