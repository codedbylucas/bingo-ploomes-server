import { UserAndHisCards } from 'src/user/entities/types/user-and-his-cards.type';

export type RoomWithUsersAndCards = {
  room: {
    id: string;
    name: string;
    status: boolean;
    ballTime: number;
    userCards: number;
    users: UserAndHisCards[];
  };
};
