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

  async createCard(createCardDto: CreateCardDto): Promise<Card[]> {
    const data: Prisma.CardCreateInput = {
      numbers: {
        B: [8, 2, 12, 7, 10],
        I: [29, 23, 20, 17, 22],
        N: [38, 31, 43, 43, 35],
        G: [46, 46, 52, 50, 56],
        O: [64, 71, 68, 66, 68],
      },
      user: {
        connect: {
          id: createCardDto.userId,
        },
      },
    };

    const cards = [];
    for (let i = 0; i < createCardDto.userCards; i++) {
      const card: Card = await this.prisma.card
        .create({
          data,
          select: {
            id: true,
            numbers: true,
          },
        })
        .catch(serverError);

      cards.push(card);
    }

    return cards;
  }
}

let colB: number[] = [];
let colI: number[] = [];
let colN: number[] = [];
let colG: number[] = [];
let colO: number[] = [];

let card: unknown = {
  B: colB,
  I: colI,
  N: colN,
  G: colG,
  O: colO,
};

function cardGenerator(
  colLetter: number[],
  max: number,
  min: number,
): number[] {
  while (colLetter.length < 5) {
    const randomNums = Math.floor(Math.random() * (max - min)) + min;
    if (!colLetter.includes(randomNums)) {
      colLetter.push(randomNums);
    }
  }
  return colLetter;
}

function userCard(numberOfUserCards: number): void {
  for (let i = 0; i < numberOfUserCards; i++) {
    cardGenerator(colB, 16, 1);
    cardGenerator(colI, 31, 16);
    cardGenerator(colN, 46, 31);
    cardGenerator(colG, 61, 46);
    cardGenerator(colO, 76, 61);
    colB = [];
    colI = [];
    colN = [];
    colG = [];
    colO = [];
    console.log(card);
    card = {
      B: colB,
      I: colI,
      N: colN,
      G: colG,
      O: colO,
    };
  }
}
userCard(3);
