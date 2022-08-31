export type Round = {
  id: string;
  drawnNumbers: number[];
  bingoBall?: number;
  roomId: string;
  winningUserId?: string;
};
