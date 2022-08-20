import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { serverError } from 'src/utils/server-error.util';
import { UserAndRoomAuth } from './types/user-id-auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { userId: string }) {
    const user = await this.prisma.user
      .findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          nickname: true,
          rooms: {
            select: {
              room: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })
      .catch(serverError);

    if (!user) {
      throw new UnauthorizedException('User not found or not authorized!');
    }
    const userAndRoom: UserAndRoomAuth = {
      userId: user.id,
      nickname: user.nickname,
      roomId: user.rooms[0].room.id,
      roomName: user.rooms[0].room.name,
    };

    return userAndRoom;
  }
}
