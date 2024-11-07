import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    const sessionUser = {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
    };
    done(null, sessionUser);
  }

  deserializeUser(sessionUser: any, done: (err: Error, payload: any) => void) {
    done(null, sessionUser);
  }
}
