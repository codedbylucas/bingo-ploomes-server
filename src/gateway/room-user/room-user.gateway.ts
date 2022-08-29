import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { notFoundError } from 'src/utils/not-found.util';
import { serverError } from 'src/utils/server-error.util';
import { Gateway } from '../gateway';
import { RoomSocket } from '../types/room-socket.type';
import { UserSocket } from '../types/user-socket.type';

@Injectable()
export class RoomUserGateway {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => Gateway))
    private readonly gateway: Gateway,
  ) {}
  public rooms: RoomSocket[] = [];

  async findRoomAndUser(
    userId: string,
    roomId: string,
    clientId: string,
  ): Promise<RoomSocket> {
    const userRoom = await this.prisma.userRoom
      .findUnique({
        where: {
          userId_roomId: {
            userId: userId,
            roomId: roomId,
          },
        },
        select: {
          room: {
            select: {
              id: true,
              ballTime: true,
              drawnNumbers: true,
            },
          },
          user: {
            select: {
              id: true,
              nickname: true,
              score: true,
              cards: {
                select: {
                  numbers: true,
                },
              },
            },
          },
        },
      })
      .catch(serverError);

    notFoundError(
      userRoom,
      `user this id (${userId}) or room this id: (${roomId})`,
    );

    const roomAndUser: RoomSocket = {
      id: userRoom.room.id,
      ballTime: userRoom.room.ballTime,
      drawnNumbers: userRoom.room.drawnNumbers,
      ballCounter: 0,
      lastSixBalls: [],
      users: [
        {
          clientId: clientId,
          id: userRoom.user.id,
          nickname: userRoom.user.nickname,
          score: userRoom.user.score,
          cards: userRoom.user.cards,
        },
      ],
    };

    return roomAndUser;
  }

  createRoomAndUserOnSocket(roomAndUser: RoomSocket): void {
    this.rooms.push(roomAndUser);
  }

  saveAUserInTheRoom(user: UserSocket, roomId: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === roomId) {
        this.rooms[i].users.push(user);
      }
    }
  }

  async findUserById(userId: string): Promise<UserSocket> {
    const user = await this.prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          id: true,
          nickname: true,
          score: true,
          cards: {
            select: {
              numbers: true,
            },
          },
        },
      })
      .catch(serverError);

    notFoundError(user, `user with this id: (${userId})`);

    return user;
  }

  
}
