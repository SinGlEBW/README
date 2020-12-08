/*
  svg имеет свой документ. Когда подключаем svg через object нужно из внешнего js достучаться
  до его элементов. Для этого видел такой способ. Работает если страница загрузилась иначе не успевает 
  подхватить файл.
*/
window.onload=function() {

//взяли объект с svg и подключились конкретно к документу svg. Это объект #document
  let docSVG = document.querySelector('.oInSvg').contentDocument;
  
  let polygon = docSVG.querySelector('polygon');

 
}
