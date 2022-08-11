import { Card } from 'src/card/entities/card.entity';

export type UserAndHisCards = {
  id: string;
  nickname: string;
  score: number;
  cards: Card[];
};
