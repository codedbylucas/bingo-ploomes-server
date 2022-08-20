export class ValidateBingo {
  colB = [];
  colI = [];
  colN = [];
  colG = [];
  colO = [];

  private card = {
    B: this.colB,
    I: this.colI,
    N: this.colN,
    G: this.colG,
    O: this.colO,
  };

  cardGenerator(colLetter: any, max: number, min: number) {
    while (colLetter.length < 5) {
      const randomNums = Math.floor(Math.random() * (max - min)) + min;
      if (!colLetter.includes(randomNums)) {
        colLetter.push(randomNums);
      }
    }
    return colLetter;
  }
  //---------------------------------------------------------------
  createUserCard(numberOfUserCards: number) {
    for (let i = 0; i < numberOfUserCards; i++) {
      this.cardGenerator(this.colB, 16, 1);
      this.cardGenerator(this.colI, 31, 16);
      this.cardGenerator(this.colN, 46, 31);
      this.cardGenerator(this.colG, 61, 46);
      this.cardGenerator(this.colO, 76, 61);
      this.card = {
        B: this.colB,
        I: this.colI,
        N: this.colN,
        G: this.colG,
        O: this.colO,
      };
    }
    return this.card;
  }

  createNums(min = 1, max = 75) {
    return Array.from({ length: max - min + 1 }).map((unused, i) => i + min);
  }
  allBalls = this.createNums();
  //---------------------------------------------------------------

  shuffle(a: number[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  drawnNumbers = this.shuffle(this.allBalls);

  //---------------------------------------------------------------

  sortCalledBalls(lastCalledBallIndex: number) {
    const cloneDrawnNums = [...this.drawnNumbers];
    const readyToVerifyBingo = cloneDrawnNums
      .reverse()
      .splice(75 - lastCalledBallIndex)
      .reverse();

    const sortedObj = { B: [], I: [], N: [], G: [], O: [] };

    for (const num of readyToVerifyBingo) {
      if (num >= 1 && num <= 15) {
        sortedObj.B.push(num);
      } else if (num > 15 && num <= 30) {
        sortedObj.I.push(num);
      } else if (num > 30 && num <= 45) {
        sortedObj.N.push(num);
      } else if (num > 45 && num <= 60) {
        sortedObj.G.push(num);
      } else if (num > 60 && num <= 75) {
        sortedObj.O.push(num);
      }
    }
    return sortedObj;
  }
  //---------------------------------------------------------------

  checkVerticalBingo(userObj: any, ballsObj: any) {
    const len = Object.keys(userObj);
    const result = {} as any;
    len.forEach((key: string) => {
      if (userObj[key].every((item: number) => ballsObj[key].includes(item))) {
        result[key] = true;
      } else {
        result[key] = false;
      }
    });

    if (Object.values(result).includes(true)) {
      return true;
    } else {
      return false;
    }
  }

  //---------------------------------------------------------------

  checkHorizontalBingo = (userObj: any, ballsObj: any) => {
    const keys = Object.keys(userObj);
    const calledBalls: number[] = this.objToArray(ballsObj);
    const result: any = new Object();

    for (let index = 0; index < 5; index++) {
      const row: number[] = [];

      keys.forEach((key) => {
        row.push(userObj[key][index]);
      });

      if (row.every((item) => calledBalls.includes(item))) {
        result[`line${index + 1}`] = true;
      } else {
        result[`line${index + 1}`] = false;
      }
    }
    if (Object.values(result).includes(true)) {
      return true;
    } else {
      return false;
    }
  };

  //---------------------------------------------------------------

  objToArray = (item: any) => {
    const keys = Object.keys(item);
    const result: number[] = [];
    keys.forEach((key) => {
      result.push(...item[key]);
    });
    return result;
  };

  //---------------------------------------------------------------
  checkDiagonalBingo = (userObj: any, ballsObj: any) => {
    const keys = Object.keys(userObj);
    const calledBalls = this.objToArray(ballsObj);
    const result: any = new Object();

    const row: number[] = [];

    keys.forEach((key, i) => {
      row.push(userObj[keys[i]][i]);
    });

    if (row.every((item) => calledBalls.includes(item))) {
      result['diagonal'] = true;
    } else {
      result['diagonal'] = false;
    }

    if (Object.values(result).includes(true)) {
      return true;
    } else {
      return false;
    }
  };

  checkReverseDiagonal = (userObj: any, ballsObj: any) => {
    const keys = Object.keys(userObj);
    const calledBalls = this.objToArray(ballsObj);
    const result: any = new Object();

    const row: number[] = [];
    keys.reverse().forEach((key, i) => {
      userObj[keys[i]][i];
      row.push(userObj[keys[i]][i]);
    });

    if (row.every((item) => calledBalls.includes(item))) {
      result['diagonal'] = true;
    } else {
      result['diagonal'] = false;
    }

    if (Object.values(result).includes(true)) {
      return true;
    } else {
      return false;
    }
  };

  //---------------------------------------------------------------

  validateBingo(userObj: unknown, ballsObj: unknown): void {
    const resultDown = this.checkVerticalBingo(userObj, ballsObj);
    const resultRow = this.checkHorizontalBingo(userObj, ballsObj);
    const resultDiagonal = this.checkDiagonalBingo(userObj, ballsObj);
    const resultReverse = this.checkReverseDiagonal(userObj, ballsObj);

    console.log(resultDown, resultRow, resultDiagonal, resultReverse);
    if (
      resultDown == true ||
      resultRow == true ||
      resultDiagonal == true ||
      resultReverse == true
    ) {
      console.log('Kudos! You WON a BINGO!');
    } else {
      console.log('You deserve a PENALTY');
    }
  }

  // private bingoCard = this.createUserCard(1);
  // private compare = this.sortCalledBalls(40);

  // validateBingo(this.bingoCard, this.compare);
}
