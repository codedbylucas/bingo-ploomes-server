import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { serverError } from 'src/utils/server-error.util';
import { Gateway } from '../gateway';
import { RoomSocket } from '../types/room-socket.type';

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

    const roomAndUser: RoomSocket = {
      id: userRoom.room.id,
      ballTime: userRoom.room.ballTime,
      drawnNumbers: userRoom.room.drawnNumbers,
      ballCounter: 0,
      lastSixBalls: [],
      users: [
        {
          clientId: clientId,
          userId: userRoom.user.id,
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
}
