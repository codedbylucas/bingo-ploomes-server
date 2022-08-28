import { GeneratedCard } from 'src/card/types/generated-card.type';

export type UserWhithSelf = {
  id: string;
  nickname: string;
  score: number;
  isSelf: boolean;
  host: boolean,
  cards: [
    {
      id: string;
      numbers: GeneratedCard;
    },
  ];
};
