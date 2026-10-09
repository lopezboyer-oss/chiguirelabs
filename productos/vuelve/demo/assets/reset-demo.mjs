const key='vuelve-cafe-demo-v4',dialog=document.querySelector('#reset-dialog'),undo=document.querySelector('#undo-demo');
const status=document.querySelector('#reset-status');
try{undo.hidden=!localStorage.getItem(key+'-previous');}catch{undo.hidden=true;}
document.querySelector('#reset-demo').onclick=()=>dialog.showModal();
document.querySelector('#cancel-reset').onclick=()=>dialog.close();
document.querySelector('#confirm-reset').onclick=()=>{try{const previous=localStorage.getItem(key);if(previous)localStorage.setItem(key+'-previous',previous);localStorage.removeItem(key);dialog.close();undo.hidden=!previous;status.textContent='Muestra reiniciada. La próxima vista cargará datos nuevos de ejemplo.';}catch{status.textContent='Este navegador no permite reiniciar los datos.';}};
undo.onclick=()=>{try{const previous=localStorage.getItem(key+'-previous');if(previous){localStorage.setItem(key,previous);status.textContent='Se restauró la muestra anterior.';}}catch{status.textContent='Este navegador no permite restaurar los datos.';}};
