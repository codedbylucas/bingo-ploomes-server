import { Module } from '@nestjs/common';
import { CardService } from 'src/card/card.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { RoomUserController } from './room-user.controller';
import { RoomUserService } from './room-user.service';

@Module({
  controllers: [RoomUserController],
  providers: [
    RoomUserService,
    UserService,
    RoomService,
    PrismaService,
    CardService,
  ],
})
export class RoomUserModule {}
