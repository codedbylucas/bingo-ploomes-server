import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { serverError } from 'src/utils/server-error.util';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const data: Prisma.CardCreateInput = {
      numbers: [
        1, 12, 6, 4, 15, 16, 19, 18, 29, 30, 31, 42, 33, 39, 45, 46, 57, 48, 52,
        60, 61, 72, 64, 74, 75,
      ],
      user: {
        connect: {
          id: createCardDto.userId,
        },
      },
    };

    const card: Card = await this.prisma.card
      .create({
        data,
        select: {
          id: true,
          numbers: true,
        },
      })
      .catch(serverError);

    return card;
  }
}
