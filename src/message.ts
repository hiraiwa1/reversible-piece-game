
/** メッセージの表示 */
export function showMessage (str: string, isAfterHidden: boolean) {
  const messageEl = document.querySelector<HTMLTextAreaElement>('#message');

  if(messageEl) {
    messageEl.textContent = str;

    if(isAfterHidden) {
      setTimeout(() => {
        messageEl.textContent = ''
      }, 1000)
    }
  }
}

/** ゲーム終了時のテキスト */
export function finishedMessage (white: number, black: number) {
  const isAfterHidden = false;
  if(white > black) {
    showMessage('白の勝ち!!', isAfterHidden);
  } else if(white < black) {
    showMessage('黒の勝ち!!', isAfterHidden);
  } else {
    showMessage('引き分け', isAfterHidden);
  }
}