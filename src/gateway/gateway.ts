import { Injectable } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { CardService } from 'src/card/card.service';
import { GeneratedCard } from 'src/card/types/generated-card.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { serverError } from 'src/utils/server-error.util';
import { RoomIdUserId } from './types/receive-room-and-user.type';
import { RoomSocket } from './types/room-socket.type';

@Injectable()
@WebSocketGateway(8001, {
  cors: 'http://localhost:3000',
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
})
export class BallsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly cardService: CardService,
  ) {}
  @WebSocketServer()
  io: Server;

  private rooms: RoomSocket[] = [];

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

    const userReconnect = this.rooms.map((element) =>
      element.users.find((user) => user.userId === userId),
    );

    if (userReconnect.length === 0 || userReconnect[0] === undefined) {
      const roomWhithUser: RoomSocket = await this.findRoomAndUser(
        userId,
        roomId,
        client.id,
      );
      this.createRoomAndUserOnSocket(roomWhithUser);

      client.join(roomId);

      this.io.to(roomId).emit('new-user', roomWhithUser.users[0]);

      this.io.to(roomId).emit('remove-button-bingo', false);

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

    const roomWhithUser: RoomSocket = await this.findRoomAndUser(
      userId,
      roomId,
      client.id,
    );

    const timer: number = +(roomWhithUser.ballTime + '000');

    this.emitNewBall(roomWhithUser.drawnNumbers, roomId);
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === roomId) {
        this.rooms[i].interval = setInterval(() => {
          this.emitNewBall(roomWhithUser.drawnNumbers, roomId);
        }, timer);
      }
    }
  }

  emitNewBall(drawnNumber: number[], roomId: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === roomId) {
        if (this.rooms[i].ballCounter === 75) {
          this.rooms[i].ballCounter = 0;
          clearInterval(this.rooms[i].interval);
          this.io.to(roomId).emit('new-ball', {
            end: true,
          });
        } else {
          if (this.rooms[i].lastSixBalls.length < 6) {
            this.rooms[i].lastSixBalls.push(
              drawnNumber[this.rooms[i].ballCounter],
            );
          } else {
            this.rooms[i].lastSixBalls.splice(0, 1);
            this.rooms[i].lastSixBalls.push(
              drawnNumber[this.rooms[i].ballCounter],
            );
          }
          this.io.to(roomId).emit('new-ball', {
            ball: drawnNumber[this.rooms[i].ballCounter],
            lastSixBalls: this.rooms[i].lastSixBalls,
          });

          this.rooms[i].ballCounter++;
        }
      }
    }
  }

  @SubscribeMessage('check-bingo')
  async checkBingo(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomAndUser: RoomIdUserId,
  ) {
    const { userId, roomId } = roomAndUser;

    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === roomId) {
        clearInterval(this.rooms[i].interval);
      }
    }
    console.log('rooooom', roomId);
    const roomWhithUser: RoomSocket = await this.findRoomAndUser(
      userId,
      roomId,
      client.id,
    );

    const room = this.rooms.find((room) => room.id === roomId);
    const user = room.users.find((user) => user.userId === userId);

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
      this.io.to(roomId).emit('verify-bingo', {
        bingo: true,
        nickname: user.nickname,
        score: user.score + 1,
      });
      console.log('bingou');
    } else {
      this.io.to(roomId).emit('verify-bingo', {
        bingo: false,
        nickname: user.nickname,
        score: user.score - 1,
      });

      this.io.to(roomId).emit('remove-button-bingo', true);

      const timeOut = async () => {
        for (let i = 0; i < this.rooms.length; i++) {
          if (this.rooms[i].id === roomId) {
            const roomWhithUser2: RoomSocket = await this.findRoomAndUser(
              userId,
              roomId,
              client.id,
            );
            const drawnNumbers: number[] = roomWhithUser2.drawnNumbers;

            const timer: number = +(roomWhithUser.ballTime + '000');

            this.rooms[i].interval = setInterval(() => {
              this.emitNewBall(drawnNumbers, roomId);
            }, timer);
          }
        }
      };

      setTimeout(timeOut, 5000);
    }
  }

  async findRoomAndUser(
    userId: string,
    roomId: string,
    clientId: string,
  ): Promise<RoomSocket> {
    const userRoom = await this.prisma.userRoom
      .findUnique({
        where: {
          userId_roomId: {
            userId: userId,
            roomId: roomId,
          },
        },
        select: {
          room: {
            select: {
              id: true,
              ballTime: true,
              drawnNumbers: true,
            },
          },
          user: {
            select: {
              id: true,
              nickname: true,
              score: true,
              cards: {
                select: {
                  numbers: true,
                },
              },
            },
          },
        },
      })
      .catch(serverError);

    const roomAndUser: RoomSocket = {
      id: userRoom.room.id,
      ballTime: userRoom.room.ballTime,
      drawnNumbers: userRoom.room.drawnNumbers,
      ballCounter: 0,
      lastSixBalls: [],
      users: [
        {
          clientId: clientId,
          userId: userRoom.user.id,
          nickname: userRoom.user.nickname,
          score: userRoom.user.score,
          cards: userRoom.user.cards,
        },
      ],
    };

    return roomAndUser;
  }

  createRoomAndUserOnSocket(roomAndUser: RoomSocket): void {
    this.rooms.push(roomAndUser);
  }
}
