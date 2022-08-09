import { User } from 'src/user/entities/user.entity';

export class Room {
  id: string;
  name: string;
  drawnNumbers: number[];
  status: boolean;
  users: User;
}
