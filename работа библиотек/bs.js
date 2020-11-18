/*
  Файл browser-sync был утерян. Частично восстанавливаю.
*/
browserSync.init({
  server: { 
    baseDir: "app",
    directory: false, // показывает список файлов 
    index: "index.html",//следит за index
    // serveStaticOptions: {
    //   extensions: ["html"]
    // }
  },
  watch: true,//режим слежки для файлов
  files: [
    'app/**/**/*.html', 
    'app/Lesson/**/*.php',
    'app/js/**/*.js',
    {
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
  port: 8080, 
 
  //browser: ["google chrome", "firefox"]//какие браузеры открывать
  startPath: "React/public/index.html" //можно указать точное местоположение открываемого файла
});