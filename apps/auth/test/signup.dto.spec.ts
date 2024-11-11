import { validate } from 'class-validator';
import { SignUpDto } from '../src/auth/dto/signup.dto';

describe('SignUpDto', () => {
  const createDto = (data: Partial<SignUpDto> = {}): SignUpDto => {
    const dto = new SignUpDto();
    Object.assign(dto, {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
      ...data,
    });
    return dto;
  };

  describe('password validation', () => {
    it('비밀번호 길이가 8자 미만이면 실패', async () => {
      const dto = new SignUpDto();
      dto.email = 'test@example.com';
      dto.password = 'Pass1';
      dto.name = 'Test User';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isLength');
      expect(errors[0].constraints.isLength).toBe('비밀번호는 8-32자 사이여야 합니다.');
    });

    it('비밀번호 길이가 32자 초과면 실패', async () => {
      const dto = new SignUpDto();
      dto.email = 'test@example.com';
      dto.password = 'Password123'.repeat(4);
      dto.name = 'Test User';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isLength');
      expect(errors[0].constraints.isLength).toBe('비밀번호는 8-32자 사이여야 합니다.');
    });

    it('비밀번호에 문자가 없으면 실패', async () => {
      const dto = createDto({ password: '12345678' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('matches');
      expect(errors[0].constraints.matches).toBe('비밀번호는 숫자와 문자를 모두 포함해야 합니다.');
    });

    it('비밀번호에 숫자가 없으면 실패', async () => {
      const dto = createDto({ password: 'Password' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('matches');
      expect(errors[0].constraints.matches).toBe('비밀번호는 숫자와 문자를 모두 포함해야 합니다.');
    });

    it('올바른 비밀번호 형식이면 성공', async () => {
      const dto = new SignUpDto();
      dto.email = 'test@example.com';
      dto.password = 'Password123';
      dto.name = 'Test User';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('email validation', () => {
    it('이메일 형식이 올바르지 않으면 실패', async () => {
      const dto = createDto({ email: 'invalid-email' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints.isEmail).toBeDefined();
    });

    it('올바른 이메일 형식이면 성공', async () => {
      const dto = createDto();
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('name validation', () => {
    it('이름이 문자열이 아니면 실패', async () => {
      const dto = createDto();
      (dto as any).name = 123;
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints.isString).toBeDefined();
    });

    it('올바른 이름이면 성공', async () => {
      const dto = createDto();
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
