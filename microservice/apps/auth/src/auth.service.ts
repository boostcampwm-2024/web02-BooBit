import {
  Injectable,
  ConflictException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '@app/grpc/account.interface';
import { AccountCreateResponseDto } from '@app/grpc/dto/account.create.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject('ACCOUNT_PACKAGE') private client: ClientGrpc,
  ) {}

  private accountService;

  onModuleInit() {
    this.accountService = this.client.getService<AccountService>('AccountService');
  }

  async signup(signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto;

    const exists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        userId: true,
        email: true,
        name: true,
      },
    });

    const accountCreateResult: AccountCreateResponseDto = await firstValueFrom(
      this.accountService.createAccount({ userId: user.userId.toString() }),
    );

    if (accountCreateResult.status !== 'SUCCESS') {
      await this.prisma.user.delete({
        where: { userId: user.userId },
      });
      throw new InternalServerErrorException('Failed to create account');
    }

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return {
        userId: user.userId,
        email: user.email,
        name: user.name,
      };
    }
    return null;
  }
}
