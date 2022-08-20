import { User } from 'src/user/entities/user.entity';

export class Room {
  id: string;
  name: string;
  status: boolean;
  ballTime: number;
  userCards: number;
}
