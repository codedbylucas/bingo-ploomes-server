import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { PrismaModule } from './prisma/prisma.module';
import { CardModule } from './card/card.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [UserModule, RoomModule, PrismaModule, CardModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
