import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserToRoomResponse } from 'src/room/entities/types/user-to-room-response.type';
import { UserToRoom } from 'src/room/entities/types/user-to-room.type';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { serverError } from 'src/utils/server-error.util';

@Injectable()
export class RoomUserService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => RoomService))
    private readonly roomService: RoomService,
  ) {}

  async connectUserToRoom(userToRoom: UserToRoom): Promise<UserToRoomResponse> {
    await this.roomService.checkIfThereIsARoom(userToRoom.roomId);
    await this.userService.checkIfThereIsAnUser(userToRoom.userId);

    const data: Prisma.UserRoomCreateInput = {
      room: {
        connect: {
          id: userToRoom.roomId,
        },
      },
      user: {
        connect: {
          id: userToRoom.userId,
        },
      },
    };

    const userConnectedWithTheRoom: UserToRoomResponse =
      await this.prisma.userRoom
        .create({
          data,
          select: {
            room: {
              select: {
                id: true,
                name: true,
                status: true,
                ballTime: true,
                userCards: true,
              },
            },
            user: {
              select: {
                id: true,
                nickname: true,
                score: true,
              },
            },
          },
        })
        .catch(serverError);

    return userConnectedWithTheRoom;
  }
}
