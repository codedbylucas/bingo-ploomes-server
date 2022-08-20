import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { notFoundError } from 'src/utils/not-found.util';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthUserResponse } from './types/user-auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async authUser(userAuthDto: UserAuthDto): Promise<AuthUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userAuthDto.userId },
      select: {
        id: true,
      },
    });

    notFoundError(user, `user with this id: (${userAuthDto.userId})`);

    return {
      token: this.jwtService.sign({ userId: user.id }),
    };
  }
}
