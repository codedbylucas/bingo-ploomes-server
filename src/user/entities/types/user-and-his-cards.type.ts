import { AssembledCard } from 'src/card/entities/types/assembled-card.type';

export type UserAndHisCards = {
  id: string;
  nickname: string;
  score: number;
  cards: AssembledCard[];
};
