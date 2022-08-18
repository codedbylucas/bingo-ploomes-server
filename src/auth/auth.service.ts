import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthUserResponse } from './types/user-auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async authUser(userAuthDto: UserAuthDto): Promise<AuthUserResponse> {
    const user = await this.userService.findSingleUser(userAuthDto.userId);

    return {
      token: this.jwtService.sign({ user }),
      userId: user.id,
    };
  }
}
