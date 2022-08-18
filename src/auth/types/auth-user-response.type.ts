import { GeneratedCard } from 'src/card/entities/types/generated-card.type';
import { User } from 'src/user/entities/user.entity';

type cardsOfUser = {
  id: string;
  numbers: GeneratedCard;
};

export type AuthUserResponse = {
  token: string;
  user: User;
  cards: cardsOfUser[];
};
