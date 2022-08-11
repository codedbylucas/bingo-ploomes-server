import { Module } from '@nestjs/common';
import { CardService } from 'src/card/card.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomService } from 'src/room/room.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, RoomService, CardService],
})
export class UserModule {}
