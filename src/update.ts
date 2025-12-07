import data from "./data";
import { finishedMessage, showMessage } from "./message";
import { canFlip, getFlipCells } from "./play";
import utile from "./utile";


/** 石を追加 */
export function put(row: number, col: number, color: number) {
  const betweenCell = document.querySelector(`#cell${row}${col}`)

  if(!betweenCell) return;
  betweenCell.innerHTML = '●'
  betweenCell.className = `cell ${color == utile.BLACK ? 'black' : 'white'}`;
  data.boardData[row][col] = color;
}

/** 現在の石の数 */
const countBlackWhite = () => {
  /** 黒石の数 */
  let numBlack = 0
  /** 白石の数 */
  let numWhite = 0;

  for (let x = 0; x < utile.CEL_NUM; x++) {
    for (let y = 0; y < utile.CEL_NUM; y++) {
      if(data.boardData[x][y] === utile.WHITE) {
        numWhite++;
      }
      if(data.boardData[x][y] === utile.BLACK) {
        numBlack++;
      }
    }
  }

  return [ numBlack, numWhite ]
}

export function update() {
  let [ numBlack, numWhite ] = countBlackWhite();

  const blackEl = document.querySelector('#numBlack');
  if(blackEl) blackEl.textContent = `${numBlack}`;
  const whiteEl = document.querySelector('#numWhite');
  if(whiteEl) whiteEl.textContent = `${numWhite}`

  /** 黒反転できるか否か */
  let blackFlip = canFlip(utile.BLACK);
  /** 白反転できるか否か */
  let whiteFlip = canFlip(utile.WHITE);

  if(numWhite + numBlack === 64 || (!blackFlip && !whiteFlip)) {
    // 石の置き場がない
    finishedMessage(numWhite, numBlack);
    return;
  }

  /** ボードセルの総数 */
  const cellLength = data.boardData.length * data.boardData[0].length;
  if(!blackFlip && ((numWhite + numBlack) <= (cellLength - 2))) {
    showMessage('黒スキップ', true)
    data.myTurn = false;
  } else if(!whiteFlip) {
    showMessage('白スキップ', true);
    data.myTurn = true;
  } else {
    data.myTurn = !data.myTurn;
  }

  if(!data.myTurn) {
    setTimeout(think, 1000);
  }
}

function think() {
  /** 今の高得点 */
  let highScore = -1000;
  /** 白石の置き場 x */
  let px = -1;
  /** 白石の置き場 y */
  let py = -1;

  for (let x = 0; x < utile.CEL_NUM; x++) {
    for (let y = 0; y < utile.CEL_NUM; y++) {
      let tmpData = [...copyData()];

      let flipped = getFlipCells(x, y, utile.WHITE);

      if(flipped.length > 0) {
        flipped.forEach((flippedItem) => {
          let p = flippedItem[0];
          let q = flippedItem[1];

          // 仮に白石を置く
          tmpData[p][q] = utile.WHITE
          tmpData[x][y] = utile.WHITE;
        });

        /** 仮に石を置いた場合の得点 */
        let score = calcWeightData(tmpData);

        if(score > highScore) {
          highScore = score;
          px = x;
          py = y;
        }
      }
    }
  }

  if(px >= 0 && py >= 0) {

    /** 挟んだ箇所を裏返す */
    let flipped = getFlipCells(px, py, utile.WHITE)
    if(flipped.length > 0) {
      flipped.forEach((flippedItem) => {
        console.log(flippedItem);

        put(flippedItem[0], flippedItem[1], utile.WHITE);
      });
    }
    /** 白石追加 */
    put(px, py, utile.WHITE);
  }

  update();
}

/** 白のスコア計算  */
function calcWeightData(tmpData: number[][]) {
  let score = 0;
  for (let x = 0; x < utile.CEL_NUM; x++) {
    for (let y = 0; y < utile.CEL_NUM; y++) {
      if(tmpData[x] && tmpData[x][y] === utile.WHITE) {
        score += data.weightData[x][y];
      }
    }
  }
  return score;
}

function copyData() {
  let tmpData: number[][] = []
  for (let x = 0; x < utile.CEL_NUM; x++) {
    tmpData[x] = []
    for (let y = 0; y < utile.CEL_NUM; y++) {
      tmpData[x][y] = data.boardData[x][y];
    }
  }
  return tmpData;
}