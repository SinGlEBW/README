/*#########----------<{ Использование через командную строку }>---------########### */
/*
  Что бы использовать командную строку нужно ставить пакет глобально
  uglify работает только с ES5. Проще установить babelify
  uglifyjs --compress --mangle -- input.js

*/
const { minify } = require('uglify-js');
let code = 'Код переводит только ES5'

let result = minify(code, option)

option = {
  toplevel: false, // Если хотим чт бы переменные тоже сокращались то true
  sourceMap: {
    filename: "out.js",
    url: "out.js.map"
} // передать объект, если вы хотите указать параметры исходной карты. 
}