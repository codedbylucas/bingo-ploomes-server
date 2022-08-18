import { User } from 'src/user/entities/user.entity';
import { Room } from '../../room/entities/room.entity';

export type UserToRoomResponse = {
  room: Room;
  user: User;
};
