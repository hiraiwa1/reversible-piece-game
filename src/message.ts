

export function showMessage (str: string) {
  const messageEl = document.querySelector('#message');
  if(messageEl) {
    messageEl.textContent = str;

    setTimeout(() => {
      messageEl.textContent = ''
    }, 2000)
  }
}

export function finishedMessage (white: number, black: number, textEl: HTMLTextAreaElement) {
  if(white > black) {
    textEl.textContent = '白の勝ち!!';
  } else if(white < black) {
    textEl.textContent = '黒の勝ち!!';
  } else {
    textEl.textContent = '引き分け';
  }
}