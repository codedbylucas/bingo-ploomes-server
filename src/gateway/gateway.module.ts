import { Module } from '@nestjs/common';
import { CardService } from 'src/card/card.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomUserService } from 'src/room-user/room-user.service';
import { RoomService } from 'src/room/room.service';
import { RoundService } from 'src/round/round.service';
import { UserService } from 'src/user/user.service';
import { BallsGateway } from './balls/balls.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { Gateway } from './gateway';
import { RoomUserGateway } from './room-user/room-user.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    Gateway,
    CardService,
    UserService,
    RoomService,
    RoomUserService,
    RoomUserGateway,
    BallsGateway,
    ChatGateway,
    RoundService
  ],
})
export class GatewayModule {}
