import { AuthenticatedGuard } from './authenticated.guard';

describe('AuthenticatedGuard', () => {
  it('should be defined', () => {
    expect(new AuthenticatedGuard()).toBeDefined();
  });
});
