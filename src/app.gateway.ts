import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway(4444, { cors: '*' })
export class AppGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log(message);
    this.server.emit('message', message);
  }
}
