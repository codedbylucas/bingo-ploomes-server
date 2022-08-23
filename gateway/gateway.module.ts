import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';

@Module({
  providers: [AppGateway],
})
export class GatewayModule {}
