import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Gateway } from '../gateway';
import { RoomUserGateway } from '../room-user/room-user.gateway';
import { DrawnNumberAndKey } from './types/drawn-number-key.type';

@Injectable()
export class BallsGateway {
  constructor(
    private readonly roomUserGateway: RoomUserGateway,

    @Inject(forwardRef(() => Gateway))
    private readonly gateway: Gateway,
  ) {}

  emitNewBall(drawnNumbers: number[], roomId: string) {
    this.roomUserGateway.rooms.forEach((room, i) => {
      if (room.id === roomId) {
        if (room.ballCounter === 75) {
          this.roomUserGateway.rooms[i].ballCounter = 0;
          clearInterval(this.roomUserGateway.rooms[i].interval);
          clearInterval(this.roomUserGateway.rooms[i].ballCounterInterval);
          this.gateway.io.to(roomId).emit('stop-balls', { stop: true });
        } else {
          const ballAndKey: DrawnNumberAndKey =
            this.checkNumberAndReturnKeyAndNumber(
              drawnNumbers[this.roomUserGateway.rooms[i].ballCounter],
            );

          this.gateway.io.to(roomId).emit('new-ball', {
            ballAndKey: ballAndKey,
            lastSixBalls: this.roomUserGateway.rooms[i].lastSixBalls,
          });
        }
      }
    });
  }

  ballCounterIntervalAndPushLastSixBalls(
    drawnNumbers: number[],
    index: number,
  ) {
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

  checkNumberAndReturnKeyAndNumber(drawnNumber: number): DrawnNumberAndKey {
    if (drawnNumber >= 1 && drawnNumber <= 15) {
      return {
        drawnNumber: drawnNumber,
        key: 'B',
      };
    } else if (drawnNumber >= 16 && drawnNumber <= 30) {
      return {
        drawnNumber: drawnNumber,
        key: 'I',
      };
    } else if (drawnNumber >= 31 && drawnNumber <= 45) {
      return {
        drawnNumber: drawnNumber,
        key: 'N',
      };
    } else if (drawnNumber >= 46 && drawnNumber <= 60) {
      return {
        drawnNumber: drawnNumber,
        key: 'G',
      };
    } else if (drawnNumber >= 61 && drawnNumber <= 75) {
      return {
        drawnNumber: drawnNumber,
        key: 'O',
      };
    }
  }
}
