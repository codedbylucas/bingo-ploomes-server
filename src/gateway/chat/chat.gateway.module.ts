import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomUserService } from 'src/room-user/room-user.service';
import { Gateway } from '../gateway';
import { RoomUserGateway } from '../room-user/room-user.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [Gateway, RoomUserService, RoomUserGateway],
})
export class ChatGatewayModule {}
