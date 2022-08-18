import { Card } from 'src/card/entities/card.entity';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';

export type RoomUserAndCards = {
  room: Room;
  user: User;
  cards: Card[];
};
