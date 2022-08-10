import { User } from 'src/user/entities/user.entity';

export type CreateCard = {
  id: string;
  numbers: {
    b: number[];
    i: number[];
    n: number[];
    g: number[];
    o: number[];
  };
  user: User;
};
