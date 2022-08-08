import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [RoomService, UserService],
})
export class RoomModule {}
