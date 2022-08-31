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
@WebSocketGateway({
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

    for (let i = 0; i < this.roomUserGateway.rooms.length; i++) {
      if (this.roomUserGateway.rooms[i].id === roomId) {
        this.roomUserGateway.rooms[i].status = true;

        this.ballsGateway.emitNewBall(roomWhithUser.drawnNumbers, roomId);
        this.roomUserGateway.rooms[i].interval = setInterval(() => {
          this.ballsGateway.emitNewBall(roomWhithUser.drawnNumbers, roomId);
        }, timer);

        this.ballsGateway.ballCounterIntervalAndPushLastSixBalls(
          roomWhithUser.drawnNumbers,
          i,
        );
        this.roomUserGateway.rooms[i].ballCounterInterval = setInterval(() => {
          this.ballsGateway.ballCounterIntervalAndPushLastSixBalls(
            roomWhithUser.drawnNumbers,
            i,
          );
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
          clearInterval(this.roomUserGateway.rooms[i].ballCounterInterval);
          this.roomUserGateway.rooms[i].ballCounter = 0;
        }
      }

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

      for (let i = 0; i < this.roomUserGateway.rooms.length; i++) {
        if (this.roomUserGateway.rooms[i].id === roomId) {
          for (let x = 0; x < this.roomUserGateway.rooms[i].users.length; x++) {
            if (this.roomUserGateway.rooms[i].users[x].id === userId) {
              this.roomUserGateway.rooms[i].users[x].punishment = true;

              const timer: number = +(roomWhithUser.ballTime + '000') * 5;

              setTimeout(() => {
                this.roomUserGateway.rooms[i].users[x].punishment = false;
                this.io
                  .to(this.roomUserGateway.rooms[i].users[x].clientId)
                  .emit('button-bingo', true);
              }, timer);
              return;
            }
          }
        }
      }
    }
  }

  @SubscribeMessage('chat-msg')
  chat(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatMessage) {
    const { userId, roomId, message } = payload;

    this.chatGateway.saveMessageToRoom(payload);
  }

  async createAndConnectUserinRoom(
    userId: string,
    roomId: string,
    client: Socket,
  ) {
    const roomWhithUser: RoomSocket =
      await this.roomUserGateway.findRoomAndUser(userId, roomId, client.id);

    this.roomUserGateway.createRoomAndUserOnSocket(roomWhithUser);

    client.join(roomId);

    // console.log(roomWhithUser);
  }

  async userJoinARoom(userId: string, roomId: string, client: Socket) {
    const user = await this.roomUserGateway.findUserById(userId);

    this.roomUserGateway.saveAUserInTheRoom(user, roomId);
    this.changeUserClientId(userId, roomId, client.id);

    const room = this.roomUserGateway.rooms.find((room) => room.id === roomId);

    client.join(roomId);

    if (room.status) {
      this.io.to(roomId).emit('button-bingo', true);
    } else {
      this.io.to(roomId).emit('button-bingo', false);
    }

    this.io.to(roomId).emit('new-user', room.users);

    if (room.messages.length > 0) {
      this.io.to(client.id).emit('new-message', room.messages);
    }
  }

  userReconnect(userId: string, roomId: string, client: Socket) {
    const room: RoomSocket = this.roomUserGateway.rooms.find(
      (room) => room.id === roomId,
    );

    if (!room) {
      console.log(`Room with ID ${roomId} not found`);
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const user: UserSocket = room.users.find((user) => user.id === userId);

    this.changeUserClientId(userId, roomId, client.id);

    client.join(roomId);

    this.io.to(roomId).emit('new-user', room.users);
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

  changeUserClientId(userId: string, roomId: string, clientId: string): string {
    for (let i = 0; i < this.roomUserGateway.rooms.length; i++) {
      if (this.roomUserGateway.rooms[i].id === roomId) {
        for (let x = 0; x < this.roomUserGateway.rooms[i].users.length; x++) {
          if (this.roomUserGateway.rooms[i].users[x].id === userId) {
            const clientID: string = (this.roomUserGateway.rooms[i].users[
              x
            ].clientId = clientId);

            return clientID;
          }
        }
      }
    }
  }
}
