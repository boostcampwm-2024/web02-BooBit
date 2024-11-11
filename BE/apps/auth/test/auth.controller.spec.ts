// auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { ConflictException } from '@nestjs/common';
import { LocalAuthGuard } from '../src/auth/guards/local-auth.guard';
import { AuthenticatedGuard } from '../src/auth/guards/authenticated.guard';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signup: jest.fn(),
    validateUser: jest.fn(),
  };

  const mockLocalAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
    logIn: jest.fn(),
  };

  const mockAuthenticatedGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockLocalAuthGuard)
      .overrideGuard(AuthenticatedGuard)
      .useValue(mockAuthenticatedGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };

    it('회원가입 성공시 사용자 정보 반환', async () => {
      const expectedResponse = {
        user_id: '1',
        email: signupDto.email,
        name: signupDto.name,
      };
      mockAuthService.signup.mockResolvedValue(expectedResponse);

      const result = await controller.signup(signupDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signup).toHaveBeenCalledWith(signupDto);
    });

    it('이메일 중복시 409 상태코드 반환', async () => {
      mockAuthService.signup.mockRejectedValue(new ConflictException('Email already exists'));

      await expect(controller.signup(signupDto)).rejects.toThrow(ConflictException);
      expect(mockAuthService.signup).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('login', () => {
    const mockUser = {
      user_id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };

    it('로그인 성공시 사용자 정보 반환', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const result = await controller.login(mockRequest);

      expect(result).toEqual({
        user_id: mockUser.user_id,
        email: mockUser.email,
        name: mockUser.name,
      });
    });
  });

  describe('getProfile', () => {
    const mockUser = {
      user_id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };

    it('인증된 사용자의 프로필 정보 반환', () => {
      const mockRequest = {
        user: mockUser,
      };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('세션 삭제 및 로그아웃 메시지 반환', () => {
      const mockSession = {
        destroy: jest.fn().mockImplementation((cb) => {
          if (typeof cb === 'function') cb();
        }),
      };
      const mockRequest = {
        session: mockSession,
      };

      const mockResponse: Partial<Response> = {
        clearCookie: jest.fn().mockReturnThis(),
      };

      const result = controller.logout(mockRequest, mockResponse as Response);

      expect(mockSession.destroy).toHaveBeenCalled();
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('sid');
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
