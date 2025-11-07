import './style.css'
import { put, update } from './update';
import data from './data';
import utile from './utile';
import { getFlipCells } from './play';



function init() {
  const boardEl = document.querySelector('#board');
  if(!boardEl) return;

  for (let i = 0; i < utile.CEL_NUM; i++) {
    data.data[i] = Array(utile.CEL_NUM).fill(0)
    for (let j = 0; j < utile.CEL_NUM; j++) {
      const rect = document.createElement('div');
      rect.className = 'cell';
      rect.id = `cell${i}${j}`;
      rect.innerHTML = `<span>cell${i}${j}</span>`
      rect.addEventListener('click', clicked);
      boardEl.appendChild(rect);
    }
  }

  put(3, 3, utile.black);
  put(4, 4, utile.black);
  put(3, 4, utile.white);
  put(4, 3, utile.white);
  update();
}

function clicked(event: Event) {
  if(!data.myTurn) return;
  const target = event.target as HTMLDivElement;
  if(!target) return;
  const id = target.id;

  const idNum = id.replace('cell', '').split('')

  let i = parseInt(idNum[0]);
  let j = parseInt(idNum[1]);

  let flipped = getFlipCells(i, j, utile.black);

  if(flipped.length > 0) {
    for (let k = 0; k < flipped.length; k++) {
      put(flipped[k][0], flipped[k][1], utile.black);
    }

    put(i, j, utile.black);
    update();
  }
}



window.addEventListener('DOMContentLoaded', () => {
  init();
})