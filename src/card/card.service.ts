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

  async createCard(createCardDto: CreateCardDto) {
    const data: Prisma.CardCreateInput = {
      numbers: {
        b: [8, 2, 12, 7, 10],
        i: [29, 23, 20, 17, 22],
        n: [38, 31, 43, 43, 35],
        g: [46, 46, 52, 50, 56],
        o: [64, 71, 68, 66, 68],
      },
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
