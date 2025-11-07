import data from "./data";
import utile from "./utile";

export function getFlipCells(i: number, j: number, color: number) {
  const cell = data.data[i][j]

  if(cell === utile.black || cell == utile.white) {
    // クリックしたセルが既に置いてあったら
    return [];
  }

  let dirs = [ // 自石の回り
    [-1, -1],[ 0, -1],[ 1, -1],
    [-1,  0],         [ 1,  0],
    [-1,  1],[ 0,  1],[ 1,  1],
  ];

  let result: number[][] = [];
  for (let p = 0; p < dirs.length; p++) {
    let flipped = getFlipCellsOneDir(i, j, dirs[p][0], dirs[p][1], color)
    result = result.concat(flipped);
  }

  return result;
}

const isCellRange = (x: number, y: number) => {
  if(
      x < 0 || // x が0より小さい
      y < 0 || // y が0より小さい
      x > 7 || // x が7より大き
      y > 7    // y が7より大き
  ) return false;
  if(data.data[x][y] === 0) return false;

  return true;
}

/** 挟むセルの配列 */
function getFlipCellsOneDir(i: number, j: number, dx: number, dy: number, color: number) {

  let x = i + dx;
  let y = j + dy;

  let flipped = [];
  let cell = data.data[x] ? data.data[x][y] : undefined;

  if(!isCellRange(x, y)) return [];
  if(cell !== undefined && cell === color) { // 同じ色
    return [];
  }

  flipped.push([x, y]);

  while (true) {
    x += dx;
    y += dy;
    if(x < 0 || y < 0 || x > 7 || y > 7 || data.data[x][y] == 0) return [];

    if(data.data[x] && data.data[x][y] === color) {
      return flipped;
    } else {
      flipped.push([x, y]);
    }

  }
}

/** ゲームが終了していないか */
export function canFlip(color: number) {
  for (let x = 0; x < utile.CEL_NUM; x++) {
    for (let y = 0; y < utile.CEL_NUM; y++) {

      const flipped = getFlipCells(x, y, color);

      if(flipped.length > 0) {
        return true;
      }
    }
  }
  return false;
}