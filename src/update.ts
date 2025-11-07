import data from "./data";
import { finishedMessage, showMessage } from "./message";
import { canFlip, getFlipCells } from "./play";
import utile from "./utile";


export function put(i: number, j: number, color: number) {
  const betweenCell = document.querySelector(`#cell${i}${j}`)

  if(!betweenCell) return;
  betweenCell.innerHTML = '●'
  betweenCell.className = `cell ${color == utile.black ? 'black' : 'white'}`;
  data.data[i][j] = color;
}

export function update() {
  let numBlack = 0
  let numWhite = 0;

  for (let x = 0; x < utile.CEL_NUM; x++) {
    for (let y = 0; y < utile.CEL_NUM; y++) {
      if(data.data[x][y] === utile.white) {
        numWhite++;
      }
      if(data.data[x][y] === utile.black) {
        numBlack++;
      }
    }
  }

  const blackEl = document.querySelector('numBlack');
  if(blackEl) blackEl.textContent = `${numBlack}`;
  const whiteEl = document.querySelector('numWhite');
  if(whiteEl) whiteEl.textContent = `${numWhite}`

  let blackFlip = canFlip(utile.black); // 黒反転できるか否か
  let whiteFlip = canFlip(utile.white); // 白反転できるか否か

  if(numWhite + numBlack === 64 || (!blackFlip && !whiteFlip)) {
    const textEl = document.querySelector<HTMLTextAreaElement>('#message');
    if(textEl) finishedMessage(numWhite, numBlack, textEl);
    return;
  }

  if(!blackFlip) {
    showMessage('黒スキップ')
    data.myTurn = false;
  } else if(!whiteFlip) {
    showMessage('白スキップ');
    data.myTurn = true;
  } else {
    data.myTurn = !data.myTurn;
  }

  if(!data.myTurn) {
    setTimeout(think, 1000);
  }
}

function think() {
  let highScore = -1000;
  let px = -1;
  let py = -1;

  for (let x = 0; x < utile.CEL_NUM; x++) {
    for (let y = 0; y < utile.CEL_NUM; y++) {
      let tmpData = [...copyData()];

      let flipped = getFlipCells(x, y, utile.white);

      if(flipped.length > 0) {
        flipped.forEach((flippedItem) => {
          let p = flippedItem[0];
          let q = flippedItem[1];

          tmpData[p][q] = utile.white
          tmpData[x][y] = utile.white;
        });
        let score = calcWeightData(tmpData);

        if(score > highScore) {
          highScore = score;
          (px = x), (py = y)
        }
      }
    }
  }

  if(px >= 0 && py >= 0) {
    let flipped = getFlipCells(px, py, utile.white)
    if(flipped.length > 0) {
      flipped.forEach((flippedItem) => {
        put(flippedItem[0], flippedItem[1], utile.white);
      });
    }
    put(px, py, utile.white);
  }

  update();
}

function calcWeightData(tmpData: number[][]) {
  let score = 0;
  for (let x = 0; x < utile.CEL_NUM; x++) {
    for (let y = 0; y < utile.CEL_NUM; y++) {
      if(tmpData[x] && tmpData[x][y] === utile.white) {
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
      tmpData[x][y] = data.data[x][y];
    }
  }
  return tmpData;
}