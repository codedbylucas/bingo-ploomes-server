import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NumberOfUserCardsInARoom } from 'src/user/types/number-of-user-cards-in-a-room.type';
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

  sortCalledBalls(
    lastCalledBallIndex: number,
    drawnNumbers: number[],
  ): GeneratedCard {
    const readyToVerifyBingo: number[] = drawnNumbers
      .reverse()
      .splice(75 - lastCalledBallIndex)
      .reverse();

    const sortedObj: GeneratedCard = { B: [], I: [], N: [], G: [], O: [] };

    for (const num of readyToVerifyBingo) {
      if (num >= 1 && num <= 15) {
        sortedObj.B.push(num);
      } else if (num > 15 && num <= 30) {
        sortedObj.I.push(num);
      } else if (num > 30 && num <= 45) {
        sortedObj.N.push(num);
      } else if (num > 45 && num <= 60) {
        sortedObj.G.push(num);
      } else if (num > 60 && num <= 75) {
        sortedObj.O.push(num);
      }
    }

    return sortedObj;
  }

  checkVerticalBingo(
    userCards: GeneratedCard[],
    sortedObj: GeneratedCard,
  ): boolean {
    const result = {};

    for (let card of userCards) {
      if (
        card['B'].every((number: number) => sortedObj['B'].includes(number))
      ) {
        result['B'] = true;
      }
      if (
        card['I'].every((number: number) => sortedObj['I'].includes(number))
      ) {
        result['I'] = true;
      }
      if (
        card['N'].every((number: number) => sortedObj['N'].includes(number))
      ) {
        result['N'] = true;
      }
      if (
        card['G'].every((number: number) => sortedObj['G'].includes(number))
      ) {
        result['G'] = true;
      }
      if (
        card['O'].every((number: number) => sortedObj['O'].includes(number))
      ) {
        result['O'] = true;
      }
    }

    if (Object.values(result).includes(true)) {
      return true;
    } else {
      return false;
    }
  }

  checkHorizontalBingo = (
    userCards: GeneratedCard[],
    sortedObj: GeneratedCard,
  ): boolean => {
    const keys = ['B', 'I', 'N', 'G', 'O'];
    const calledBalls: number[] = [];

    const result: boolean[] = [];

    for (let i = 0; i < 5; i++) {
      sortedObj[`${keys[i]}`].map((number: number) => {
        calledBalls.push(number);
      });
    }

    for (let card of userCards) {
      for (let i = 0; i < 5; i++) {
        const row: number[] = [];

        keys.forEach((key) => {
          row.push(card[key][i]);
        });

        if (row.every((item) => calledBalls.includes(item))) {
          result.push(true);
        } else {
          result.push(false);
        }
      }
    }

    if (result.includes(true)) {
      return true;
    } else {
      return false;
    }
  };

  checkDiagonalBingo(
    userCards: GeneratedCard[],
    sortedObj: GeneratedCard,
  ): boolean {
    const keys = ['B', 'I', 'N', 'G', 'O'];
    const calledBalls: number[] = [];

    const result: boolean[] = [];

    for (let i = 0; i < 5; i++) {
      sortedObj[`${keys[i]}`].map((number: number) => {
        calledBalls.push(number);
      });
    }

    for (let card of userCards) {
      const row: number[] = [];

      keys.forEach((key, x) => {
        row.push(card[keys[x]][x]);
      });

      if (row.every((item) => calledBalls.includes(item))) {
        result.push(true);
      } else {
        result.push(false);
      }
    }

    if (result.includes(true)) {
      return true;
    } else {
      return false;
    }
  }

  checkReverseDiagonal(
    userCards: GeneratedCard[],
    sortedObj: GeneratedCard,
  ): boolean {
    const keys = ['B', 'I', 'N', 'G', 'O'];
    const calledBalls: number[] = [];

    const result: boolean[] = [];

    for (let i = 0; i < 5; i++) {
      sortedObj[`${keys[i]}`].map((number: number) => {
        calledBalls.push(number);
      });
    }

    for (let card of userCards) {
      const row: number[] = [];

      keys.reverse().forEach((key, i) => {
        row.push(card[keys[i]][i]);
      });

      if (row.every((item) => calledBalls.includes(item))) {
        result.push(true);
      } else {
        result.push(false);
      }
    }

    if (result.includes(true)) {
      return true;
    } else {
      return false;
    }
  }
}
