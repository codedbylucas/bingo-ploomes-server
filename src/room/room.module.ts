import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CardService } from 'src/card/card.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomUserService } from 'src/room-user/room-user.service';
import { RoundService } from 'src/round/round.service';
import { UserService } from 'src/user/user.service';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [RoomController],
  providers: [
    RoomService,
    UserService,
    CardService,
    RoomUserService,
    AuthService,
    JwtService,
    RoundService
  ],
})
export class RoomModule {}
