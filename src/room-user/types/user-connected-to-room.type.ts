import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';

export type UserConnectedToRoom = {
  room: Room;
  user: User;
};
