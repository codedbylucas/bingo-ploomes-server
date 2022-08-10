import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CardService } from 'src/card/card.service';
import { Card } from 'src/card/entities/card.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/room/room.service';
import { notFoundError } from 'src/utils/not-found.util';
import { serverError } from 'src/utils/server-error.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAndHisCards } from './entities/types/user-and-his-cards.type';
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

  async createUser(createUserDto: CreateUserDto): Promise<UserAndHisCards> {
    await this.roomService.checkIfThereIsARoom(createUserDto.roomId);
    const data: Prisma.UserCreateInput = {
      nickname: createUserDto.nickname,
      score: 0,
      room: {
        connect: {
          id: createUserDto.roomId,
        },
      },
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

    const card: Card = await this.cardService.createCard({ userId: user.id });
    const cardNumbers = this.assembledCard(card.numbers);

    const userAndHisCards: UserAndHisCards = {
      id: user.id,
      nickname: user.nickname,
      score: user.score,
      cards: [{ id: card.id, numbers: cardNumbers }],
    };
    return userAndHisCards;
  }

  assembledCard(cardNumbers: number[]) {
    const assembledCard = { b: [], i: [], n: [], g: [], o: [] };

    for (let i = 0; i < cardNumbers.length; i++) {
      if (i < 5) {
        assembledCard.b.push(cardNumbers[i]);
      } else if (i >= 5 && i < 10) {
        assembledCard.i.push(cardNumbers[i]);
      } else if (i >= 10 && i < 15) {
        assembledCard.n.push(cardNumbers[i]);
      } else if (i >= 15 && i < 20) {
        assembledCard.g.push(cardNumbers[i]);
      } else if (i >= 20 && i < 25) {
        assembledCard.o.push(cardNumbers[i]);
      }
    }
    return assembledCard;
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
    await this.checkIfThereIsAnUser(userId);
    const singleUserData: User = await this.prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          id: true,
          nickname: true,
          score: true,
        },
      })
      .catch(serverError);
    return singleUserData;
  }

  async checkIfThereIsAnUser(userId: string): Promise<void> {
    const user = await this.prisma.user
      .findUnique({ where: { id: userId } })
      .catch(serverError);
    notFoundError(user, `user with this id: (${userId})`);
  }
}
