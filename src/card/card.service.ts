import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NumberOfUserCardsInARoom } from 'src/user/entities/types/number-of-user-cards-in-a-room.type';
import { UserService } from 'src/user/user.service';
import { serverError } from 'src/utils/server-error.util';
import { Card } from './entities/card.entity';
import { GeneratedCard } from './types/generated-card.type';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createCard(userId: string): Promise<Card[]> {
    const numberOfUserCardsInARoom: NumberOfUserCardsInARoom =
      await this.userService.searchAUserAndNumberOfCards(userId);

    const numbersOfCards: number =
      numberOfUserCardsInARoom.rooms[0].room.userCards;

    const generatedCards: GeneratedCard[] = this.cardsGenerator(numbersOfCards);

    const cards: Card[] = [];

    for (let i = 0; i < numbersOfCards; i++) {
      const data: Prisma.CardCreateInput = {
        numbers: generatedCards[i],
        user: {
          connect: {
            id: userId,
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

      cards.push(card);
    }

    return cards;
  }

  cardsGenerator(numberOfUserCards: number): GeneratedCard[] {
    const generatedCards: GeneratedCard[] = [];

    let card: GeneratedCard = {
      B: [],
      I: [],
      N: [],
      G: [],
      O: [],
    };

    const cardGenerator = (
      colLetter: number[],
      max: number,
      min: number,
    ): number[] => {
      while (colLetter.length < 5) {
        const randomNums: number =
          Math.floor(Math.random() * (max - min)) + min;
        if (!colLetter.includes(randomNums)) {
          colLetter.push(randomNums);
        }
      }
      return colLetter;
    };

    for (let i = 0; i < numberOfUserCards; i++) {
      cardGenerator(card.B, 16, 1);
      cardGenerator(card.I, 31, 16);
      cardGenerator(card.N, 46, 31);
      cardGenerator(card.G, 61, 46);
      cardGenerator(card.O, 76, 61);

      generatedCards.push(card);
      card = {
        B: [],
        I: [],
        N: [],
        G: [],
        O: [],
      };
    }

    return generatedCards;
  }
}
