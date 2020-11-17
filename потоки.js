/*eslint-disable*/
/*--чистый NodeJS-- https://habr.com/ru/post/479048/*/

/*
  Объекты запрос и ответ являются потоками.
*/
let readStream = fs.createReadStream(путь_к_файлу); // создаёт прочтение потока

readStream.on("open", function () {
  readStream.pipe(res); //т.к. res это поток, а pipe работает с данными Stream то передаёт поток в поток объекта ответа
});
readStream.on("error", function (err) {
  res.end(err); //в случаях ошибок упадут сюда, после чего закроем закроем соединение
});

//старый вариант
const file = fs.readFileSync("path to file"); //не Stream

res.send(file);

/*
Разница лишь в том, что в первом случае мы загружаем часть файла и отправляем ее, 
таким образом, не загружая оперативную память сервера. Во втором случае мы сразу загружаем файл 
целиком в оперативную память и только потом отправляем.
*/

//Создание потока
const { Readable } = require('stream');

// 1 - Используя конструктор
const myReadable1 = new Readable(opt);

// 2 - Наследуя класс 
class myReadable2 extends Readable {
  constructor(opt) {
    super(opt);
  }
}
opt // принимает параметры
let read = new myReadable2({highWaterMark })//highWaterMark — это максимальное количество.по умолчанию 16кб