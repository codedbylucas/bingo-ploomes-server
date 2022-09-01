import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserAndRoomAuth } from 'src/auth/types/user-id-auth.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { notFoundError } from 'src/utils/not-found.util';
import { serverError } from 'src/utils/server-error.util';
import { Room } from './entities/room.entity';
import { CreateRoom } from './types/create-room.type';
import { RoomUsersUserSelfCards } from './types/room-users-and-user-self-cards.type';
import { UserWhithSelf } from './types/user-whith-self.type';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createRoom(createRoom: CreateRoom): Promise<Room> {
    const allNumbersDrawn: number[] = this.createAllNumbersDrawn();

    const data: Prisma.RoomCreateInput = {
      name: createRoom.name,
      drawnNumbers: allNumbersDrawn,
      status: true,
      ballTime: createRoom.ballTime,
      userCards: createRoom.userCards,
    };

    const room: Room = await this.prisma.room
      .create({
        data,
        select: {
          id: true,
          name: true,
          status: true,
          ballTime: true,
          userCards: true,
        },
      })
      .catch(serverError);

    return room;
  }

  createAllNumbersDrawn(): number[] {
    const allNumbersDrawn: number[] = [];

    while (allNumbersDrawn.length < 75) {
      const drawnNumbers: number = Math.floor(Math.random() * (76 - 1)) + 1;
      if (!allNumbersDrawn.includes(drawnNumbers)) {
        allNumbersDrawn.push(drawnNumbers);
      }
    }

    return allNumbersDrawn;
  }

  async findSingleRoomWhithUsersAndCards(
    userAndRoom: UserAndRoomAuth,
  ): Promise<RoomUsersUserSelfCards> {
    const roomWithUsersAndCards = await this.prisma.room
      .findUnique({
        where: {
          id: userAndRoom.roomId,
        },
        select: {
          id: true,
          name: true,
          status: true,
          ballTime: true,
          userCards: true,
          users: {
            select: {
              user: {
                select: {
                  id: true,
                  nickname: true,
                  score: true,
                  host: true,
                  cards: {
                    select: {
                      id: true,
                      numbers: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .catch(serverError);

    notFoundError(
      roomWithUsersAndCards,
      `room with this id: (${userAndRoom.roomId})`,
    );

    const roomWithUsersCardsAndUserSelf = this.setUserSelf(
      roomWithUsersAndCards,
      userAndRoom,
    );

    return roomWithUsersCardsAndUserSelf;
  }

  async findAllRooms(): Promise<Room[]> {
    const rooms: Room[] = await this.prisma.room
      .findMany({
        select: {
          id: true,
          name: true,
          status: true,
          ballTime: true,
          userCards: true,
        },
      })
      .catch(serverError);
    notFoundError(rooms, `rooms`);

    return rooms;
  }

  async checkIfThereIsARoom(roomId: string): Promise<void> {
    const room = await this.prisma.room
      .findUnique({
        where: { id: roomId },
        select: {
          id: true,
          userCards: true,
        },
      })
      .catch(serverError);
    notFoundError(room, `room with this id: (${roomId})`);
  }

  setUserSelf(
    roomWithUsersAndCards: any,
    userAndRoom: UserAndRoomAuth,
  ): RoomUsersUserSelfCards {
    const usersWhithSelf: UserWhithSelf[] = [];

    for (let user of roomWithUsersAndCards.users) {
      let userModify: UserWhithSelf;

      if (user.user.id === userAndRoom.userId) {
        userModify = {
          id: user.user.id,
          nickname: user.user.nickname,
          score: user.user.score,
          isSelf: true,
          host: user.user.host,
          cards: user.user.cards,
        };
      } else {
        userModify = {
          id: user.user.id,
          nickname: user.user.nickname,
          score: user.user.score,
          isSelf: false,
          host: user.user.host,
          cards: user.user.cards,
        };
      }

      usersWhithSelf.push(userModify);
    }

    const roomWithUsersCardsAndUserSelf: RoomUsersUserSelfCards = {
      id: roomWithUsersAndCards.id,
      name: roomWithUsersAndCards.name,
      status: roomWithUsersAndCards.status,
      ballTime: roomWithUsersAndCards.ballTime,
      userCards: roomWithUsersAndCards.userCards,
      users: usersWhithSelf,
    };

    return roomWithUsersCardsAndUserSelf;
  }

  async checkIfTheRoomIsFull(roomId: string): Promise<void> {
    const room = await this.prisma.room
      .findUnique({
        where: { id: roomId },
        select: {
          users: true,
        },
      })
      .catch(serverError);

    console.log(room.users);
    if (room.users.length === 10) {
      throw new UnauthorizedException(`Crowded room`);
    }
  }
}
