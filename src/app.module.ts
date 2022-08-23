import { Module } from '@nestjs/common';
import { AppGateway } from 'gateway/gateway';
import { GatewayModule } from 'gateway/gateway.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomUserModule } from './room-user/room-user.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    RoomModule,
    PrismaModule,
    CardModule,
    AuthModule,
    RoomUserModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
