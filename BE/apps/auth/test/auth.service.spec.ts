import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };

    it('이메일이 중복되면 ConflictException 발생', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });

    it('회원가입 성공시 사용자 정보 반환', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        user_id: '1',
        email: signupDto.email,
        name: signupDto.name,
      });

      const result = await service.signup(signupDto);

      expect(result).toEqual({
        user_id: '1',
        email: signupDto.email,
        name: signupDto.name,
      });
    });

    it('비밀번호가 해시화되어 저장', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockImplementation(async (data) => ({
        user_id: '1',
        email: data.data.email,
        name: data.data.name,
      }));

      await service.signup(signupDto);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      expect(createCall.data.password_hash).not.toBe(signupDto.password);
      expect(await bcrypt.compare(signupDto.password, createCall.data.password_hash)).toBe(true);
    });
  });

  describe('validateUser', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('존재하지 않는 이메일이면 null 반환', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(loginDto.email, loginDto.password);

      expect(result).toBeNull();
    });

    it('비밀번호가 일치하지 않으면 null 반환', async () => {
      const hashedPassword = await bcrypt.hash('different-password', 12);
      mockPrismaService.user.findUnique.mockResolvedValue({
        user_id: '1',
        email: loginDto.email,
        name: 'Test User',
        password_hash: hashedPassword,
      });

      const result = await service.validateUser(loginDto.email, loginDto.password);

      expect(result).toBeNull();
    });

    it('인증 성공시 사용자 정보 반환', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 12);
      const mockUser = {
        user_id: '1',
        email: loginDto.email,
        name: 'Test User',
        password_hash: hashedPassword,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(loginDto.email, loginDto.password);

      expect(result).toEqual({
        user_id: '1',
        email: loginDto.email,
        name: 'Test User',
      });
    });
  });
});
