import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthUserResponse } from './types/auth-user-response.type';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async authUser(): Promise<AuthUserResponse> {
    return {
      token: 'test',
      user: undefined,
      cards: undefined,
    };
  }
}
