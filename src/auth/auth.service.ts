import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthUserResponse } from './types/user-auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async authUser(userAuthDto: UserAuthDto): Promise<AuthUserResponse> {
    const user = await this.userService.findSingleUser(userAuthDto.userId);

    return {
      token: 'test',
      user: user,
    };
  }
}
