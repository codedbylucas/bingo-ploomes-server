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

  saveMessageToRoom(payload: ChatMessage): void {
    const { userId, roomId, message } = payload;

    this.roomAndUser.rooms.forEach((room, rI) => {
      if (room.id === roomId) {
        const user = room.users.find((user) => user.id === userId);
        const text: UserMessage = {
          id: userId,
          nickname: user.nickname,
          message: message,
        };

        this.roomAndUser.rooms[rI].messages.push(text);

        this.gateway.io
          .to(roomId)
          .emit('new-message', this.roomAndUser.rooms[rI].messages);
        return;
      }
    });
  }
}
