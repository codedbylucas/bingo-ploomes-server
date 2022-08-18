import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { CardService } from 'src/card/card.service';
import { RoomUserService } from 'src/room-user/room-user.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [RoomService, UserService, CardService, RoomUserService],
})
export class RoomModule {}
