import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CardService } from 'src/card/card.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/room/room.service';
import { notFoundError } from 'src/utils/not-found.util';
import { serverError } from 'src/utils/server-error.util';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => CardService))
    private readonly cardService: CardService,

    @Inject(forwardRef(() => RoomService))
    private readonly roomService: RoomService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    let { nickname } = createUserDto;
    nickname = this.createGuestNicknameForUser(nickname);

    const data: Prisma.UserCreateInput = {
      nickname,
      score: 0,
    };

    const user: User = await this.prisma.user
      .create({
        data,
        select: {
          id: true,
          nickname: true,
          score: true,
        },
      })
      .catch(serverError);

    return user;
  }

  async findAllUsers(): Promise<User[]> {
    const users: User[] = await this.prisma.user
      .findMany({
        select: {
          id: true,
          nickname: true,
          score: true,
        },
      })
      .catch(serverError);
    notFoundError(users, 'users');
    return users;
  }

  async findSingleUser(userId: string): Promise<User> {
    const singleUser: User = await this.prisma.user
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

    notFoundError(singleUser, `user with this id: (${userId})`);

    return singleUser;
  }

  async checkIfThereIsAnUser(userId: string): Promise<void> {
    const user = await this.prisma.user
      .findUnique({
        where: { id: userId },
      })
      .catch(serverError);
    notFoundError(user, `user with this id: (${userId})`);
  }

  // async searchAUserAndNumberOfCards(
  //   userId: string,
  // ): Promise<NumberOfUserCardsInARoom> {
  //   const numbersOfCards: NumberOfUserCardsInARoom = await this.prisma.user
  //     .findUnique({
  //       where: { id: userId },
  //       select: {
  //         room: {
  //           select: {
  //             userCards: true,
  //           },
  //         },
  //       },
  //     })
  //     .catch(serverError);

  //   notFoundError(numbersOfCards, `user with this id: (${userId})`);

  //   return numbersOfCards;
  // }

  createGuestNicknameForUser(nickname: string) {
    nickname = nickname.trim();
    if (nickname == '') {
      nickname = 'Convidado';
    }
    return nickname;
  }
}
