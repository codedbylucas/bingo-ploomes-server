import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { BallsGateway } from './balls/balls.gateway';
import { DrawnNumberAndKey } from './balls/types/drawn-number-key.type';
import { ChatGateway } from './chat/chat.gateway';
import { ChatMessage } from './chat/types/chat-message.type';
import { RoomUserGateway } from './room-user/room-user.gateway';
import { RoomIdUserId } from './types/receive-room-and-user.type';
import { RoomSocket } from './types/room-socket.type';
import { UserSocket } from './types/user-socket.type';

@Injectable()
@WebSocketGateway(80, {
  cors: true,
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
})
export class Gateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly cardService: CardService,

    @Inject(forwardRef(() => RoomUserGateway))
    private readonly roomUserGateway: RoomUserGateway,

    @Inject(forwardRef(() => BallsGateway))
    private readonly ballsGateway: BallsGateway,

    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}
  @WebSocketServer()
  public io: Server;

  handleConnection(client: Socket) {
    // console.log(`client connect: ${client.id}`);
  }

  afterInit(server: any) {}

  handleDisconnect(client: Socket) {
    this.roomUserGateway.rooms.forEach((room, indexRoom) => {
      this.roomUserGateway.rooms[indexRoom].onlineUsers.forEach(
        (user, indexUser) => {
          if (user.clientId === client.id) {
            this.roomUserGateway.rooms[indexRoom].onlineUsers.splice(
              indexUser,
              1,
            );

            this.io
              .to(room.id)
              .emit(
                'new-user',
                this.roomUserGateway.rooms[indexRoom].onlineUsers,
              );
          }
        },
      );
    });
  }

  @SubscribeMessage('create-room-and-user')
  async createRoomAndUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomAndUser: RoomIdUserId,
  ): Promise<void> {
    const { userId, roomId } = roomAndUser;

    const room = this.roomUserGateway.rooms.find((room) => room.id === roomId);

    if (!room) {
      this.createAndConnectUserinRoom(userId, roomId, client);

      this.io.to(client.id).emit('button-start', true);
    } else {
      const userReconnect = room.users.find((user) => user.id === userId);

      if (!userReconnect) {
        this.userJoinARoom(userId, roomId, client);
      } else {
        this.userReconnect(userId, roomId, client);
      }
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

    this.roomUserGateway.rooms.forEach((room, i) => {
      if (room.id === roomId) {
        this.roomUserGateway.rooms[i].status = true;

        this.ballsGateway.emitNewBall(roomWhithUser.drawnNumbers, roomId);
        this.roomUserGateway.rooms[i].interval = setInterval(() => {
          this.ballsGateway.emitNewBall(roomWhithUser.drawnNumbers, roomId);
        }, timer);

        this.ballsGateway.ballCounterIntervalAndPushLastSixBalls(
          room.drawnNumbers,
          i,
        );
        this.roomUserGateway.rooms[i].ballCounterInterval = setInterval(() => {
          this.ballsGateway.ballCounterIntervalAndPushLastSixBalls(
            room.drawnNumbers,
            i,
          );
        }, timer);
      }
    });

    this.io.to(roomId).emit('button-bingo', true);
  }

  @SubscribeMessage('check-bingo')
  async checkBingo(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomAndUser: RoomIdUserId,
  ): Promise<void> {
    const { userId, roomId } = roomAndUser;

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
      this.roomUserGateway.rooms.forEach((room, i) => {
        if (room.id === roomId) {
          clearInterval(this.roomUserGateway.rooms[i].interval);
          clearInterval(this.roomUserGateway.rooms[i].ballCounterInterval);
          this.roomUserGateway.rooms[i].ballCounter = 0;
        }
      });

      this.io.to(client.id).emit('verify-bingo', {
        bingo: true,
        nickname: user.nickname,
        score: user.score + 1,
      });

      client.to(roomId).emit('user-made-point', {
        nickname: user.nickname,
      });
    } else {
      this.io.to(client.id).emit('verify-bingo', {
        bingo: false,
        nickname: user.nickname,
        score: user.score - 1,
      });

      this.io.to(client.id).emit('button-bingo', false);

      this.roomUserGateway.rooms.forEach((room, rI) => {
        if (room.id === roomId) {
          room.users.forEach((user, uI) => {
            if (user.id === userId) {
              this.roomUserGateway.rooms[rI].users[uI].punishment = true;

              const timer: number = +(roomWhithUser.ballTime + '000') * 5;

              setTimeout(() => {
                this.roomUserGateway.rooms[rI].users[uI].punishment = false;
                this.io
                  .to(this.roomUserGateway.rooms[rI].users[uI].clientId)
                  .emit('button-bingo', true);
              }, timer);
              return;
            }
          });
        }
      });
    }
  }

  @SubscribeMessage('chat-msg')
  chat(@MessageBody() payload: ChatMessage): void {
    this.chatGateway.saveMessageToRoom(payload);
  }

  async createAndConnectUserinRoom(
    userId: string,
    roomId: string,
    client: Socket,
  ): Promise<void> {
    const roomWhithUser: RoomSocket =
      await this.roomUserGateway.findRoomAndUser(userId, roomId, client.id);

    this.roomUserGateway.createRoomAndUserOnSocket(roomWhithUser);

    this.roomUserGateway.saveNewUserOnline(
      {
        id: roomWhithUser.users[0].id,
        clientId: client.id,
        nickname: roomWhithUser.users[0].nickname,
      },
      roomId,
    );

    client.join(roomId);
  }

  async userJoinARoom(
    userId: string,
    roomId: string,
    client: Socket,
  ): Promise<void> {
    const user = await this.roomUserGateway.findUserById(userId);

    this.roomUserGateway.saveAUserInTheRoom(user, roomId);
    this.roomUserGateway.saveNewUserOnline(
      { id: user.id, clientId: client.id, nickname: user.nickname },
      roomId,
    );

    this.roomUserGateway.changeUserClientId(userId, roomId, client.id);

    const room = this.roomUserGateway.rooms.find((room) => room.id === roomId);

    client.join(roomId);

    if (room.status) {
      this.io.to(roomId).emit('button-bingo', true);
    } else {
      this.io.to(roomId).emit('button-bingo', false);
    }

    this.io.to(client.id).emit('new-message', room.messages);
    this.io.to(roomId).emit('new-user', room.onlineUsers);
    if (room.status) {
      const ballAndKey: DrawnNumberAndKey =
        this.ballsGateway.checkNumberAndReturnKeyAndNumber(
          room.drawnNumbers[room.ballCounter - 1],
        );
      this.io.to(client.id).emit('user-reconnect', {
        ballAndKey: ballAndKey,
        lastSixBalls: room.lastSixBalls,
      });
    }

    this.io.to(client.id).emit('new-message', room.messages);
  }

  userReconnect(userId: string, roomId: string, client: Socket): void {
    const room: RoomSocket = this.roomUserGateway.rooms.find(
      (room) => room.id === roomId,
    );

    if (!room) {
      console.log(`Room with ID ${roomId} not found`);
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const user: UserSocket = room.users.find((user) => user.id === userId);

    this.roomUserGateway.changeUserClientId(userId, roomId, client.id);
    this.roomUserGateway.saveNewUserOnline(
      { id: user.id, clientId: client.id, nickname: user.nickname },
      roomId,
    );

    client.join(roomId);

    this.io.to(roomId).emit('new-user', room.onlineUsers);
    this.io.to(client.id).emit('new-message', room.messages);

    if (room.status) {
      if (!user.punishment) {
        this.io.to(client.id).emit('button-bingo', true);
      }
      if (user.host) {
        this.io.to(client.id).emit('button-start', false);
      }
      const ballAndKey: DrawnNumberAndKey =
        this.ballsGateway.checkNumberAndReturnKeyAndNumber(
          room.drawnNumbers[room.ballCounter - 1],
        );

      this.io.to(client.id).emit('user-reconnect', {
        ballAndKey: ballAndKey,
        lastSixBalls: room.lastSixBalls,
      });
    } else {
      this.io.to(client.id).emit('button-bingo', false);

      if (user.host) {
        this.io.to(client.id).emit('button-start', true);
      }
    }
  }
}
