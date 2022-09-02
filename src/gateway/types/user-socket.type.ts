export type UserSocket = {
  clientId?: string;
  id: string;
  nickname: string;
  score: number;
  cards: any;
  host: boolean;
  imageLink: string;
  punishment?: boolean;
};
