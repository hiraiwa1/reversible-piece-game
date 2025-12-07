import data from "./data";
import utile from "./utile";

/** 挟んでいる裏返しできる石 */
export function getFlipCells(row: number, col: number, color: number) {
  /** 石を置いたセル */
  const cell = data.boardData[row][col]

  if(cell === utile.BLACK || cell == utile.WHITE) {
    // クリックしたセルが既に置いてあったら
    return [];
  }

  /** 自石の回り */
  let dirs = [
    [-1, -1],[ 0, -1],[ 1, -1],
    [-1,  0],         [ 1,  0],
    [-1,  1],[ 0,  1],[ 1,  1],
  ];

  /** 結果 */
  let result: number[][] = [];
  for (let p = 0; p < dirs.length; p++) {
    let flipped = getFlipCellsOneDir(row, col, dirs[p][0], dirs[p][1], color)
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
  if(data.boardData[x][y] === 0) return false;

  return true;
}

/**
 * @param row - 自セルのx
 * @param col - 自セルのy
 * @param dx - 回りセルの相対的なx位置
 * @param dy - 回りセルの相対的なy位置
 * @param color - 自分の石の色
 * @returns - 挟むセルの配列
 */
function getFlipCellsOneDir(row: number, col: number, dx: number, dy: number, color: number) {

  /** 回りセルの横 */
  let x = row + dx;
  /** 回りセルの縦 */
  let y = col + dy;

  /** 挟んでいる */
  let flipped: number[][] = [];
  /** セル */
  let cell = data.boardData[x] ? data.boardData[x][y] : undefined;

  if(!isCellRange(x, y)) return [];
  if(cell !== undefined && cell === color) { // 同じ色
    return [];
  }

  /** 回りせる配列 */
  const cellArray = [x, y]
  flipped.push(cellArray);

  while (!(data.boardData[x] && data.boardData[x][y] === color)) {
    x += dx;
    y += dy;
    if(x < 0 || y < 0 || x > 7 || y > 7 || data.boardData[x][y] == 0) return [];

    flipped.push([x, y]);
  }

  return flipped;
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