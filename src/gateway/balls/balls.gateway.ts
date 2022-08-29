import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Gateway } from '../gateway';
import { RoomUserGateway } from '../room-user/room-user.gateway';

@Injectable()
export class BallsGateway {
  constructor(
    private readonly roomUserGateway: RoomUserGateway,

    @Inject(forwardRef(() => Gateway))
    private readonly gateway: Gateway,
  ) {}

  emitNewBall(drawnNumbers: number[], roomId: string) {
    for (let i = 0; i < this.roomUserGateway.rooms.length; i++) {
      if (this.roomUserGateway.rooms[i].id === roomId) {
        if (this.roomUserGateway.rooms[i].ballCounter === 75) {
          this.roomUserGateway.rooms[i].ballCounter = 0;
          clearInterval(this.roomUserGateway.rooms[i].interval);
          clearInterval(this.roomUserGateway.rooms[i].ballCounterInterval);
          this.gateway.io.to(roomId).emit('new-ball', {
            end: true,
          });
        } else {
          this.gateway.io.to(roomId).emit('new-ball', {
            ball: drawnNumbers[this.roomUserGateway.rooms[i].ballCounter],
            lastSixBalls: this.roomUserGateway.rooms[i].lastSixBalls,
          });
        }
      }
    }
  }

  ballCounterInterval(drawnNumbers: number[], index: number) {
    if (this.roomUserGateway.rooms[index].lastSixBalls.length < 6) {
      this.roomUserGateway.rooms[index].lastSixBalls.push(
        drawnNumbers[this.roomUserGateway.rooms[index].ballCounter],
      );
    } else {
      this.roomUserGateway.rooms[index].lastSixBalls.splice(0, 1);
      this.roomUserGateway.rooms[index].lastSixBalls.push(
        drawnNumbers[this.roomUserGateway.rooms[index].ballCounter],
      );
    }
    this.roomUserGateway.rooms[index].ballCounter++;
  }
}
