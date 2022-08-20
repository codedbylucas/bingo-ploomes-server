import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAndRoomAuth } from './types/user-id-auth.type';

export const AuthenticatedUser = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userAndRoom: UserAndRoomAuth = request.user;

    if (!userAndRoom) {
      throw new UnauthorizedException(
        'User does not have permission to access this route',
      );
    }

    return userAndRoom;
  },
);
