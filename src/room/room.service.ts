import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createRoomAndUserHost(createRoomDto: CreateRoomDto) {
    try {
      const allNumbersDrawn = this.createAllNumbersDrawn();

      const data: Prisma.RoomCreateInput = {
        name: createRoomDto.name,
        drawnNumbers: allNumbersDrawn,
        status: true,
        ballTime: createRoomDto.ballTime,
        useCards: createRoomDto.userCards,
      };
      const room = await this.prisma.room.create({ data });

      const userHost: CreateUserDto = {
        nickname: createRoomDto.nickname,
        roomId: room.id,
      };
      const user = await this.userService.createUser(userHost);

      return {
        roomId: room.id,
        userId: user.id,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  createAllNumbersDrawn() {
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
