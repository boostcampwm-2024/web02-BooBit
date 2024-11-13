// test/auth/session.serializer.spec.ts
import { SessionSerializer } from './session.serializer';

describe('SessionSerializer', () => {
  let serializer: SessionSerializer;

  beforeEach(() => {
    serializer = new SessionSerializer();
  });

  describe('serializeUser', () => {
    it('필요한 사용자 정보만 세션에 저장', (done) => {
      const user = {
        userId: '1',
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hash',
        created_at: new Date(),
      };

      serializer.serializeUser(user, (err, serialized) => {
        expect(err).toBeNull();
        expect(serialized).toEqual({
          user_id: '1',
          email: 'test@example.com',
          name: 'Test User',
        });
        expect(serialized).not.toHaveProperty('password_hash');
        expect(serialized).not.toHaveProperty('created_at');
        done();
      });
    });
  });

  describe('deserializeUser', () => {
    it('세션에서 사용자 정보 복원', (done) => {
      const sessionUser = {
        user_id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      serializer.deserializeUser(sessionUser, (err, deserialized) => {
        expect(err).toBeNull();
        expect(deserialized).toEqual({
          userId: '1',
          email: 'test@example.com',
          name: 'Test User',
        });
        done();
      });
    });
  });
});
