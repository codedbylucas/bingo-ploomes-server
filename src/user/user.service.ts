import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomUserService } from 'src/room-user/room-user.service';
import { UserConnectedToRoom } from 'src/room-user/types/user-connected-to-room.type';
import { UserToRoom } from 'src/room-user/types/user-to-room.type';
import { notFoundError } from 'src/utils/not-found.util';
import { serverError } from 'src/utils/server-error.util';
import { JoinUserRoom } from './dto/join-user-room.dto';
import { User } from './entities/user.entity';
import { NumberOfUserCardsInARoom } from './types/number-of-user-cards-in-a-room.type';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => RoomUserService))
    private readonly roomUserService: RoomUserService,
  ) {}

  private userSelect = {
    id: true,
    nickname: true,
    score: true,
    host: true,
  };

  async createUser(nickname: string): Promise<User> {
    nickname = this.createGuestNicknameForUser(nickname);

    const data: Prisma.UserCreateInput = {
      nickname,
      score: 0,
    };

    const user: User = await this.prisma.user
      .create({
        data,
        select: this.userSelect,
      })
      .catch(serverError);

    return user;
  }

  async joinUserWithTheRoomAndCreateTheirCards(
    joinUserRoom: JoinUserRoom,
  ): Promise<UserConnectedToRoom> {
    const user: User = await this.createUser(joinUserRoom.nickname);

    const userToRoom: UserToRoom = {
      userId: user.id,
      roomId: joinUserRoom.roomId,
    };

    const userConnectedWithTheRoom: UserConnectedToRoom =
      await this.roomUserService.userToRoomAndCreateCards(userToRoom);

    return userConnectedWithTheRoom;
  }

  async findAllUsers(): Promise<User[]> {
    const users: User[] = await this.prisma.user
      .findMany({
        select: this.userSelect,
      })
      .catch(serverError);
    notFoundError(users, 'users');
    return users;
  }

  async findSingleUser(userId: string): Promise<User> {
    const user: User = await this.prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          id: true,
          nickname: true,
          score: true,
          cards: { select: { id: true, numbers: true } },
        },
      })
      .catch(serverError);

    notFoundError(user, `user with this id: (${userId})`);

    return user;
  }

  async searchAUserAndNumberOfCards(
    userId: string,
  ): Promise<NumberOfUserCardsInARoom> {
    const numbersOfCards: NumberOfUserCardsInARoom = await this.prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          rooms: {
            select: {
              room: {
                select: {
                  userCards: true,
                },
              },
            },
          },
        },
      })
      .catch(serverError);

    notFoundError(numbersOfCards, `user with this id: (${userId})`);

    return numbersOfCards;
  }

  createGuestNicknameForUser(nickname: string): string {
    nickname = nickname.trim();
    if (nickname == '') {
      nickname = 'Convidado';
    }
    return nickname;
  }

  async setUserAsHost(userId: string): Promise<User> {
    const user: User = await this.prisma.user
      .update({
        where: { id: userId },
        data: {
          host: true,
        },
        select: {
          id: true,
          nickname: true,
          score: true,
          host: true,
        },
      })
      .catch(serverError);

    return user;
  }
}
