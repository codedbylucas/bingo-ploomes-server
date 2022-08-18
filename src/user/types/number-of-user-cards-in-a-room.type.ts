type UserCardsInRoom = {
  room: {
    userCards: number;
  };
};

export type NumberOfUserCardsInARoom = {
  rooms: UserCardsInRoom[];
};
