import { AssembledCard } from 'src/card/entities/types/createCard.type';

export type UserAndHisCards = {
  id: string;
  nickname: string;
  score: number;
  cards: AssembledCard[];
};
