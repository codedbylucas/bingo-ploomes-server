import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/room/room.service';
import { serverError } from 'src/utils/server-error.util';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => RoomService))
    private readonly roomService: RoomService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    await this.roomService.checkIfThereIsARoom(createUserDto.roomId);
    const data: Prisma.UserCreateInput = {
      nickname: createUserDto.nickname,
      score: 0,
      room: {
        connect: {
          id: createUserDto.roomId,
        },
      },
    };

    return await this.prisma.user
      .create({
        data,
        select: {
          id: true,
          roomId: true,
          nickname: true,
          score: true,
        },
      })
      .catch(serverError);
  }
}
