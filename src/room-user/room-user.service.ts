import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserConnectedToRoom } from 'src/room-user/types/user-connected-to-room.type';
import { UserToRoom } from 'src/room-user/types/user-to-room.type';
import { Room } from 'src/room/entities/room.entity';
import { RoomService } from 'src/room/room.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { serverError } from 'src/utils/server-error.util';
import { CreateRoomAndUserDto } from './dto/create-room-and-user.dto';

@Injectable()
export class RoomUserService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly roomService: RoomService,
  ) {}

  async connectUserToRoom(
    userToRoom: UserToRoom,
  ): Promise<UserConnectedToRoom> {
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

    const userConnectedWithTheRoom: UserConnectedToRoom =
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

  async createARoomAUserAndRelateThem(
    createRoomAndUserDto: CreateRoomAndUserDto,
  ) {
    const { ballTime, name, nickname, userCards } = createRoomAndUserDto;

    const user: User = await this.userService.createUser(nickname);
    const room: Room = await this.roomService.createRoom({
      name,
      ballTime,
      userCards,
    });

    const roomUser: UserConnectedToRoom = await this.connectUserToRoom({
      userId: user.id,
      roomId: room.id,
    });

    return roomUser;
  }
}
