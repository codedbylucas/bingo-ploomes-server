import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Gateway } from '../gateway';
import { RoomUserGateway } from '../room-user/room-user.gateway';
import { ChatMessage } from './types/chat-message.type';
import { UserMessage } from './types/user-message.type';

@Injectable()
export class ChatGateway {
  constructor(
    @Inject(forwardRef(() => Gateway))
    private readonly gateway: Gateway,
    private readonly roomAndUser: RoomUserGateway,
  ) {}

  saveMessageToRoom(payload: ChatMessage) {
    const { userId, roomId, message } = payload;
    console.log(payload);

    for (let i = 0; i < this.roomAndUser.rooms.length; i++) {
      if (this.roomAndUser.rooms[i].id === roomId) {
        const user = this.roomAndUser.rooms[i].users.find(
          (user) => user.id === userId,
        );

        const text: UserMessage = {
          id: userId,
          nickname: user.nickname,
          message: message,
        };

        this.roomAndUser.rooms[i].messages.push(text);

        this.gateway.io.to(roomId).emit('new-message', this.roomAndUser.rooms[i].messages);
        return;
      }
    }
  }
}
