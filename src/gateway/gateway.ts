import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { timeout } from 'cron';
import { Server, Socket } from 'socket.io';
import { CardService } from 'src/card/card.service';
import { GeneratedCard } from 'src/card/types/generated-card.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { serverError } from 'src/utils/server-error.util';
import { RoomIdUserId } from './types/receive-room-and-user.type';
import { RoomSocket } from './types/room-socket.type';
import { RoomUserGateway } from './room-user/room-user.gateway';
import { BallsGateway } from './balls/balls.gateway';

@Injectable()
@WebSocketGateway(8001, {
  cors: 'http://localhost:3000',
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
})
export class Gateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly cardService: CardService,

    @Inject(forwardRef(() => RoomUserGateway))
    private readonly roomUserGateway: RoomUserGateway,

    @Inject(forwardRef(() => BallsGateway))
    private readonly ballsGateway: BallsGateway,
  ) {}
  @WebSocketServer()
  public io: Server;

  handleConnection(client: Socket) {
    console.log(`client connect: ${client.id}`);
  }

  afterInit(server: any) {}

  handleDisconnect(client: Socket) {
    console.log(`client disconnect: ${client.id}`);
  }

  @SubscribeMessage('create-room-and-user')
  async createRoomAndUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomAndUser: RoomIdUserId,
  ): Promise<void> {
    const { userId, roomId } = roomAndUser;

    const userReconnect = this.roomUserGateway.rooms.map((element) =>
      element.users.find((user) => user.userId === userId),
    );

    if (userReconnect.length === 0 || userReconnect[0] === undefined) {
      const roomWhithUser: RoomSocket =
        await this.roomUserGateway.findRoomAndUser(userId, roomId, client.id);
      this.roomUserGateway.createRoomAndUserOnSocket(roomWhithUser);

      client.join(roomId);

      this.io.to(roomId).emit('new-user', roomWhithUser.users[0]);

      this.io.to(roomId).emit('button-bingo', false);

      console.log(roomWhithUser);
    } else {
    }
  }

  @SubscribeMessage('start-game')
  async startGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomAndUser: RoomIdUserId,
  ): Promise<void> {
    const { userId, roomId } = roomAndUser;

    const roomWhithUser: RoomSocket =
      await this.roomUserGateway.findRoomAndUser(userId, roomId, client.id);

    const timer: number = +(roomWhithUser.ballTime + '000');

    console.log('start-game');

    for (let i = 0; i < this.roomUserGateway.rooms.length; i++) {
      if (this.roomUserGateway.rooms[i].id === roomId) {
        this.ballsGateway.emitNewBall(roomWhithUser.drawnNumbers, roomId);
        this.roomUserGateway.rooms[i].interval = setInterval(() => {
          this.ballsGateway.emitNewBall(roomWhithUser.drawnNumbers, roomId);
        }, timer);

        this.ballsGateway.ballCounterInterval(roomWhithUser.drawnNumbers, i);
        this.roomUserGateway.rooms[i].ballCounterInterval = setInterval(() => {
          this.ballsGateway.ballCounterInterval(roomWhithUser.drawnNumbers, i);
        }, timer);
      }
    }

    this.io.to(roomId).emit('button-bingo', true);
  }

  @SubscribeMessage('check-bingo')
  async checkBingo(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomAndUser: RoomIdUserId,
  ) {
    const { userId, roomId } = roomAndUser;

    console.log('rooooom', roomId);
    const roomWhithUser: RoomSocket =
      await this.roomUserGateway.findRoomAndUser(userId, roomId, client.id);

    const room = this.roomUserGateway.rooms.find((room) => room.id === roomId);
    const user = roomWhithUser.users[0];

    const sortCalledBalls = this.cardService.sortCalledBalls(
      room.ballCounter,
      roomWhithUser.drawnNumbers,
    );

    const userCards: GeneratedCard[] = roomWhithUser.users[0].cards.map(
      (card) => {
        return card.numbers;
      },
    );

    const checkVerticalBingo = this.cardService.checkVerticalBingo(
      userCards,
      sortCalledBalls,
    );

    const checkHorizontalBingo = this.cardService.checkHorizontalBingo(
      userCards,
      sortCalledBalls,
    );

    const checkDiagonalBingo = this.cardService.checkDiagonalBingo(
      userCards,
      sortCalledBalls,
    );

    const checkReverseDiagonal = this.cardService.checkReverseDiagonal(
      userCards,
      sortCalledBalls,
    );

    if (
      checkDiagonalBingo ||
      checkHorizontalBingo ||
      checkReverseDiagonal ||
      checkVerticalBingo
    ) {
      for (let i = 0; i < this.roomUserGateway.rooms.length; i++) {
        if (this.roomUserGateway.rooms[i].id === roomId) {
          clearInterval(this.roomUserGateway.rooms[i].interval);
        }
      }

      this.io.to(client.id).emit('verify-bingo', {
        bingo: true,
        nickname: user.nickname,
        score: user.score + 1,
      });
      console.log('bingou');
    } else {
      this.io.to(client.id).emit('verify-bingo', {
        bingo: false,
        nickname: user.nickname,
        score: user.score - 1,
      });

      this.io.to(client.id).emit('button-bingo', false);
      for (let i = 0; i < this.roomUserGateway.rooms.length; i++) {
        if (this.roomUserGateway.rooms[i].id === roomId) {
          for (let x = 0; x < this.roomUserGateway.rooms[i].users.length; x++) {
            if (this.roomUserGateway.rooms[i].users[x].userId === user.userId) {
              const timer: number = +(roomWhithUser.ballTime + '000') * 3;
              console.log(timer);
              setTimeout(() => {
                this.io.to(client.id).emit('button-bingo', true);
              }, timer);
            }
          }
        }
      }
    }
  }
}
