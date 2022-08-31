import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { serverError } from 'src/utils/server-error.util';
import { Round } from './types/round.type';

@Injectable()
export class RoundService {
  constructor(private readonly prisma: PrismaService) {}

  createRound(roomId: string): Promise<Round> {
    const drawnNumbers = this.createAllNumbersDrawn();

    const data: Prisma.RoundCreateInput = {
      drawnNumbers: drawnNumbers,
      room: {
        connect: {
          id: roomId,
        },
      },
    };

    const round: Promise<Round> = this.prisma.round
      .create({
        data,
        select: {
          id: true,
          drawnNumbers: true,
          roomId: true,
        },
      })
      .catch(serverError);

    return round;
  }

  createAllNumbersDrawn(): number[] {
    const allNumbersDrawn: number[] = [];

    while (allNumbersDrawn.length < 75) {
      const drawnNumbers: number = Math.floor(Math.random() * (76 - 1)) + 1;
      if (!allNumbersDrawn.includes(drawnNumbers)) {
        allNumbersDrawn.push(drawnNumbers);
      }
    }

    return allNumbersDrawn;
  }
}
