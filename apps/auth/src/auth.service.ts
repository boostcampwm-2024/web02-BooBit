import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
        password_hash: passwordHash,
        name,
      },
      select: {
        userId: true,
        email: true,
        name: true,
      },
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        email: true,
        name: true,
        password_hash: true,
      },
    });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // const { password_hash, ...result } = user;
      return {
        userId: user.userId,
        email: user.email,
        name: user.name,
      };
    }
    return null;
  }
}
