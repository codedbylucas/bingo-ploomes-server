import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const data: Prisma.UserCreateInput = {
        nickname: createUserDto.nickname,
        score: 0,
        room: {
          connect: {
            id: createUserDto.roomId,
          },
        },
      };

      return await this.prisma.user.create({ data });
    } catch (error) {
      console.log(error);
    }
  }
}
