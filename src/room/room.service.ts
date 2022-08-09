import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { serverError } from 'src/utils/server-error.util';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createRoomAndUserHost(createRoomDto: CreateRoomDto): Promise<Room> {
    const allNumbersDrawn = this.createAllNumbersDrawn();

    const data: Prisma.RoomCreateInput = {
      name: createRoomDto.name,
      drawnNumbers: allNumbersDrawn,
      status: true,
      ballTime: createRoomDto.ballTime,
      useCards: createRoomDto.userCards,
    };

    const room = await this.prisma.room
      .create({
        data,
        select: {
          id: true,
          name: true,
          drawnNumbers: true,
          status: true,
          users: true,
        },
      })
      .catch(serverError);

    const userHost: CreateUserDto = {
      nickname: createRoomDto.nickname,
      roomId: room.id,
    };

    const user = await this.userService.createUser(userHost);

    const roomAndUser: Room = {
      id: room.id,
      name: room.name,
      drawnNumbers: room.drawnNumbers,
      status: room.status,
      users: user,
    };

    return roomAndUser;
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

  async findAllRooms() {
    return await this.prisma.room.findMany();
  }

  async findSingleRoom(roomId: string) {
    await this.checkIfThereIsARoom(roomId);
    const roomWithUsersAndCards = await this.prisma.room
      .findUnique({
        where: { id: roomId },
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              nickname: true,
              score: true,
            },
          },
        },
      })
      .catch(serverError);

    return roomWithUsersAndCards;
  }

  async checkIfThereIsARoom(roomId: string): Promise<void> {
    const room = await this.prisma.room
      .findUnique({ where: { id: roomId } })
      .catch(serverError);

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
  }
}
