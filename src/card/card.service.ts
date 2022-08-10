import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { serverError } from 'src/utils/server-error.util';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const data: Prisma.CardCreateInput = {
      numbers: [1, 2, 3],
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
