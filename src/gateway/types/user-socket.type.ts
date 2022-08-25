import { GeneratedCard } from 'src/card/types/generated-card.type';

export type UserSocket = {
  clientId?: string;
  userId: string;
  nickname: string;
  score: number;
  cards: any;
};
