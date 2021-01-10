/*
  Файл browser-sync был утерян. Частично восстанавливаю.
*/
const browserSync = require('browser-sync');

browserSync.init({
  server: { 
    baseDir: "app",
    directory: false, // показывает список файлов 
    index: "index.html",//следит за index
    // serveStaticOptions: {
    //   extensions: ["html"]
    // }
  },
  /*
    если нужно обновлять php, то убрать server и включить proxy указав имя которое в openServer.
    Это имя подцепиться на localhost:8080 и будет зеркалить php файл и обновлять localhost: 8080
  */
  proxy: "namePHP-site",
  port: 8080, 

  /*
   watch режим автоматической слежки за файлами. Перезагружает браузер при изменениях в каком либо файле по указанному каталогу.
   Можно не указывать строки в массиве files, но если что-то требуется взаимодействовать с другими плагинами, то
   {match и fn} указать, но в fn можно без bs.reload. Подключённые svg без их указания в files браузер не обновляет
  */

  watch: true,
  files: [
    //такая запись обновляет и следит автоматически
    'app/**/**/*.html', 
    'app/Lesson/**/*.php',
    'app/js/**/*.js',
    {
      //тут в функции потребуется ручное bs.reload() добавить 
      match: ['**/**.scss'],
      fn: (event, file) => scssCSS(file) 
    },
    { 
      match: set.convPathJSX,
      fn: (event, file) => reactJSX(file)
    }
  ],
  online: true,//при online транслирует в сеть. с гаждетов можно заходить на сайт 
  open: 'external',//Local, External - что отображать в строке URL. В Консоли есть выбор
  notify: false, //скрывает постоянное всплытие browserSync: Connected
  scrollProportionally: false,//убирает постоянный сброс к верху сайта при обновлении
 
 
  //browser: ["google chrome", "firefox"]//какие браузеры открывать
  startPath: "React/public/index.html" //можно указать точное местоположение открываемого файла
});

browserSync.watch('путь файла.',()=>{
  
  browserSync.reload()
})
/* В gulp потребуется возвращать NodeJS.ReadWriteStream объект поэтому потребуется
  
*/
browserSync.reload({stream: true})
//или
browserSync.stream()