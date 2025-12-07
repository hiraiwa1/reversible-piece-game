import './style.css'
import { put, update } from './update';
import data from './data';
import utile from './utile';
import { getFlipCells } from './play';


/** 初期実行 */
function init() {
  /** ボード要素 */
  const BOARD_EL = document.querySelector('#board');
  if(!BOARD_EL) return;

  for (let i = 0; i < utile.CEL_NUM; i++) {
    data.boardData[i] = Array(utile.CEL_NUM).fill(0)
    for (let j = 0; j < utile.CEL_NUM; j++) {

      const cellEl = document.createElement('div');
      cellEl.className = 'cell';
      cellEl.id = `cell${i}${j}`;
      cellEl.innerHTML = `<span>cell${i}${j}</span>`
      cellEl.addEventListener('click', clicked);
      BOARD_EL.appendChild(cellEl);
    }
  }

  put(3, 3, utile.BLACK);
  put(4, 4, utile.BLACK);
  put(3, 4, utile.WHITE);
  put(4, 3, utile.WHITE);
  update();
}

function clicked(event: Event) {
  if(!data.myTurn) return;

  const target = event.target as HTMLDivElement;
  if(!target) return;
  const id = target.id;

  const idNum = id.replace('cell', '').split('')

  const cellNumRow = parseInt(idNum[0]);
  const cellNumCol = parseInt(idNum[1]);

  let flipped = getFlipCells(cellNumRow, cellNumCol, utile.BLACK);

  if(flipped.length > 0) {
    for (let k = 0; k < flipped.length; k++) {
      put(flipped[k][0], flipped[k][1], utile.BLACK);
    }

    put(cellNumRow, cellNumCol, utile.BLACK);
    update();
  }
}



window.addEventListener('DOMContentLoaded', () => {
  init();
})