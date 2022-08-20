let colB = [];
let colI = [];
let colN = [];
let colG = [];
let colO = [];

let card = {
  colB,
  colI,
  colN,
  colG,
  colO,
};
//---------------------------------------------------------------

function cardGenerator(colLetter, max, min) {
  while (colLetter.length < 5) {
    const randomNums = Math.floor(Math.random() * (max - min)) + min;
    if (!colLetter.includes(randomNums)) {
      colLetter.push(randomNums);
    }
  }
  return colLetter;
}
//---------------------------------------------------------------

function userCard(numberOfUserCards) {
  for (let i = 0; i < numberOfUserCards; i++) {
    cardGenerator(colB, 16, 1);
    cardGenerator(colI, 31, 16);
    cardGenerator(colN, 46, 31);
    cardGenerator(colG, 61, 46);
    cardGenerator(colO, 76, 61);
    card = {
      colB,
      colI,
      colN,
      colG,
      colO,
    };
  }
  return card;
}

//---------------------------------------------------------------

function createNums(min = 1, max = 75) {
  return Array.from({ length: max - min + 1 }).map((unused, i) => i + min);
}
const allBalls = createNums();
//---------------------------------------------------------------

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const drawnNumbers = shuffle(allBalls);
//---------------------------------------------------------------

function sortCalledBalls(lastCalledBallIndex) {
  const cloneDrawnNums = [...drawnNumbers];
  const readyToVerifyBingo = cloneDrawnNums
    .reverse()
    .splice(75 - lastCalledBallIndex)
    .reverse();

  var sortedObj = { B: [], I: [], N: [], G: [], O: [] };

  for (let num of readyToVerifyBingo) {
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

//---------------------------------------------------------------

function checkVerticalBingo(userObj, ballsObj) {
  const len = Object.keys(userObj);
  console.log(len);
  let result = {};
  len.forEach((key, index) => {
    if (userObj[key].every((item) => ballsObj[key].includes(item))) {
      result[key] = 'BINGO!';
    } else {
      result[key] = 'NO BINGO!';
    }
  });

  console.log(result);
}

//---------------------------------------------------------------

//---------------------------------------------------------------

function checkHorizontalPattern(userInLine, userObj, ballsObj) {
  const len = userInLine;

  let result = {};
  len.forEach((key, index) => {
    if (userObj[key].every((item) => ballsObj[key].includes(item))) {
      result[key] = 'BINGO!';
    } else {
      result[key] = 'NO BINGO!';
    }
  });

  console.log(result);
}

//---------------------------------------------------------------

console.log(userCard(1));
//const compare = sortCalledBalls(50);
//console.log(compare)

//checkBingo(card, compare)

// function test(userObj, i) {
//   const userCardInLine = [];
//   userCardInLine.push(
//     userObj.B[i],
//     userObj.I[i],
//     userObj.N[i],
//     userObj.G[i],
//     userObj.O[i],
//   );
//   return userCardInLine;
// }

// test(card);
// console.log(test(card, 0));

// const userCardSorted = [];
// userCardSorted.push(
//   test(card, 0),
//   test(card, 1),
//   test(card, 2),
//   test(card, 3),
//   test(card, 4),
// );

// console.log(userCardSorted);