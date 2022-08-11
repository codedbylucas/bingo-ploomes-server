import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';

@Module({
  imports: [PrismaModule],
  controllers: [CardController],
  providers: [CardService, UserService, RoomService],
})
export class CardModule {}
