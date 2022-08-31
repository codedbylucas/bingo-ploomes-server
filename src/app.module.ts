import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { BallsGatewayModule } from './gateway/balls/balls.gateway.module';
import { GatewayModule } from './gateway/gateway.module';
import { RoomUserGatewayModule } from './gateway/room-user/room-user.gateway.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomUserModule } from './room-user/room-user.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { RoundModule } from './round/round.module';

@Module({
  imports: [
    UserModule,
    RoomModule,
    PrismaModule,
    CardModule,
    AuthModule,
    RoomUserModule,
    GatewayModule,
    RoomUserGatewayModule,
    BallsGatewayModule,
    RoundModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
