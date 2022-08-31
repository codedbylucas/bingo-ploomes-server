import { UserMessage } from '../chat/types/user-message.type';
import { UserSocket } from './user-socket.type';

export type RoomSocket = {
  id: string;
  ballTime: number;
  users: UserSocket[];
  ballCounter: number;
  lastSixBalls: number[];
  interval?: NodeJS.Timer;
  ballCounterInterval?: NodeJS.Timer;
  status?: boolean;
  messages?: UserMessage[];
};
