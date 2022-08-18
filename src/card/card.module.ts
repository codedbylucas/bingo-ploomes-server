import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomUserService } from 'src/room-user/room-user.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { CardService } from './card.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [CardService, UserService, RoomService, RoomUserService],
})
export class CardModule {}
