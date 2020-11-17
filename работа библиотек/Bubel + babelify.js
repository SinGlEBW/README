/*

   npm i babelify @babel/core @babel/preset-env babel-preset-minify -D //минимум для browserify

   babel-preset-minify чуть хуже uglify-js по тестам. Мои тесты.
    Какой-то кусок кода: babel-preset-minify - 5.11кб, uglify-js - 4.63кб.   

  "@babel/core" как я понял это сам процессор транспиляции кода. Без него ниже пакеты не запашут.
  далее идут библиотеки надстройки для "@babel/core" что требуется прочитать чтоб конвертироваться в js
  '@babel/preset-env' - указывается в опциях. Транспилирует ES2015(ES6) в ES5
  '@babel/preset-react' - транспилирует JSX в ES6
  плагины
  '@babel/plugin-syntax-class-properties' - синтаксический анализ новых классов в ES6. 
  '@babel/plugin-proposal-class-properties' - будет понимать в class префикс static и преобразовывать в ES5
  пресеты
 
  есть пресеты которые содержат в себе некоторые плагины. установив их нужно указывать пресеты 
  в разделе presets
  Как я понял ниже плагины просто преобразуют в определённого вида код, но браузер не поймёт его без использования 
  дополнительных пакетов RequireJS или CommonJS
  '@babel/plugin-transform-modules-amd' - RequireJS
  '@babel/plugin-transform-modules-commonjs' - CommonJS стиль NodeJS(кажется что '@babel/preset-env' делает тоже самое,
  но это не так. Не переводит почему-то let в var)

  browserify - делает связь JS файлов разбитых на модули т.к. это не поддерживается браузерами. Для этого требуется главный JS 
  файл который будет подключаться в html
  babelify - это плагин для browserify, который имеет на борту babel. Принимает те же настройки как и babel
  
*/  
const babelify = require('babelify');
const browserify = require('browserify');
const fs = require('fs');

let jsFile = fs.readdirSync('src/js/dev');
browserify(jsFile, option)
.transform( babelify, {
  presets: ['@babel/preset-env', 'minify'],//имеем es5. minify это - babel-preset-minify. внизу это uglify. Один из них выбирать
})
.bundle((err, buffer) => {
  if (err) console.dir(err);
  else {
    let data = minify(buffer.toString()).code;
    fs.createWriteStream(outPathJS).write(data);//write не только буфер пишет
  } 
});
