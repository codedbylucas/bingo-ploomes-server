import { UserSocket } from './user-socket.type';

export type RoomSocket = {
  id: string;
  ballTime: number;
  drawnNumbers: number[];
  users: UserSocket[];
  ballCounter: number;
};
