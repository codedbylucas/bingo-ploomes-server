import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CardService } from 'src/card/card.service';
import { Card } from 'src/card/entities/card.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/room/room.service';
import { notFoundError } from 'src/utils/not-found.util';
import { serverError } from 'src/utils/server-error.util';
import { CreateUserDto } from './dto/create-user.dto';
import { NumberOfUserCardsInARoom } from './entities/types/number-of-user-cards-in-a-room.type';
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
<<<<<<< HEAD

=======
    
>>>>>>> origin/feet/userCards2
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

    const card: Card[] = await this.cardService.createCard({
      userId: user.id,
    });

    const userAndHisCards: UserAndHisCards = {
      id: user.id,
      nickname: user.nickname,
      score: user.score,
      cards: card,
    };

    return userAndHisCards;
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
      .findUnique({
        where: { id: userId },
      })
      .catch(serverError);
    notFoundError(user, `user with this id: (${userId})`);
  }

  async searchAUserAndNumberOfCards(
    userId: string,
  ): Promise<NumberOfUserCardsInARoom> {
    const numbersOfCards: NumberOfUserCardsInARoom = await this.prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          room: {
            select: {
              userCards: true,
            },
          },
        },
      })
      .catch(serverError);

    notFoundError(numbersOfCards, `user with this id: (${userId})`);

    return numbersOfCards;
  }
}
