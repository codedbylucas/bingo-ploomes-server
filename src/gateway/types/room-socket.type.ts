import { Round } from 'src/round/types/round.type';
import { UserMessage } from '../chat/types/user-message.type';
import { UserSocket } from './user-socket.type';

export type RoomSocket = {
  id: string;
  ballTime: number;
  ballCounter: number;
  lastSixBalls: number[];
  rounds: Round[];
  users: UserSocket[];
  messages?: UserMessage[];
  interval?: NodeJS.Timer;
  ballCounterInterval?: NodeJS.Timer;
  status?: boolean;
};
