import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CardService } from 'src/card/card.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomUserService } from 'src/room-user/room-user.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { BallsGateway } from './gateway';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    BallsGateway,
    JwtService,
    CardService,
    UserService,
    RoomService,
    RoomUserService,
  ],
})
export class BallsGatewayModule {}
