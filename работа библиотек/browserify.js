/* Сборщик всех файлов js в 1 файл bundle.
  Зачем это надо? Потому что браузер не понимает модульность. При попытке к нему подключить файл js
  который что-то в себя импортирует, будь то библиотеки или другие же файлы, браузер будет ругать.
  Можно пробовать пойти другим путём подключать в html один за другим js файл, но нам придётся соблюдать порядок
  подключения. Предположим мы ходим обратиться к переменной которая у нас инициализирована в другом файле,
  тот файл должен быть раньше подключён в html чем файл в котором запрашиваем иначе фиаско. И вот у нас куча файлов.
  неудобство 1. Это всё соблюсти, 2. это на каждый файл будет запрос к серверу. 10 файлов 10 запросов на скачку.
  Так что задача всё занести в 1 файл и ужать.


Собрать в bundle:     browserify js/test1.js -o js/bundle.js -d
  test1.js это основной файл к которому могут импортироваться зависимости 
   option cli
  -o  = --outfile //выходной файл
  -d  = --debug. Включить исходные карты, то есть кусок кода Source Map. Это значит что 
                 DevTools -> в Sources мы можем видеть не только сжатый файл, но и понятный человеком код. Он больше
                 нужен для разработчика, что бы можно было в случае обслуживания приложения заглянуть через панель разработчика и понять
                 что нужно править.
              browserify js/test1 -o js/bulid.js -d
              Сам по себе browserify не может собрать файл типа es6. Про import и export так же 
              export default он ничего не знает. Он работает с es5
  -t  = --transform

  Вот мы решили писать js модулями, что нам каждый раз вводить эту команду и смотреть результат?
  Или на первых парах действительно подключать кучу скриптов определённым порядком, а потом собрать и надеяться что
  всё заработает?

  Нам желательно использовать импорт, экспорт и подключить 1 файл и видеть результат. Есть несколько способов решить задачу.
  Есть библиотека watchify которая при каждом изменении модулей собирает сама bundle. 
  Есть babelify 


  #######--------<{ Как работать с browserify через API а не консоль }>--------#########

  let browserify = require('browserify');
  let b = browserify([files, CustomOptions]);//Можно погрузить файлы в files (строка или массив) или через 
    option.transform предварительно можно указать правила сжатия файла, но browserify и без этого сжимает так как надо. Для React придётся настроить
  b.add('./browser/main.js', fileOptions);//сюда тоже можно засунуть на.уя столько способов натыкали не понятно

  b.transform((file)=>{}, option)// как я понял получаем лишь путь вернуть нужно readStream иначе bundle не отработает



  CustomOptions{
    entries: '' || [], // (что за файлы) имена файлов, на которые смотреть
    basedir: string, // (где эти файлы) это каталог, из которого browserify начинает объединение для имен файлов, начинающихся с ..
  
    noParse: [], // принимает массив имён вроде как библиотек, который пропустит все require (). "Используйте это для гигантских библиотек, таких как jquery или threejs".
                 По умолчанию browserify в таких случаях учитывает только файлы  .json
    commondir: bool ,// устанавливает алгоритм, используемый для анализа общих путей. И
                    спользуйте, false чтобы выключить это, в противном случае он использует модуль commonDir .
    debug: true; //(нужны ли им карты) Включит исходные карты(Source Maps). При дэбаге да или в файлах указать будем указывать console.dir будем видеть не bundle.js а там где установили 
    ...
    paths: ''||[''] //когда мы подключаем например скаченный файлом bootstrap через entries или file, ему для работы понадобиться jquery,
              browserify начнём искать зависимость автоматически в node_modules. В path можно указать путь до jquery скаченного вручную.

  }
  
  fileOptions{
    transform: [], // это массив функций преобразования или имен модулей, которые преобразуют исходный код перед синтаксическим анализом.
    ignoreTransform: [],// массив преобразований, которые не будут выполняться, даже если они указаны в другом месте.
    plugin: [], //  массив используемых функций плагина или имен модулей. См. Подробности в разделе плагинов ниже.
    extensions: [], // это массив необязательных дополнительных расширений, которые может использовать механизм поиска модулей, когда расширение не указано. 
       
  }
    
  */
/*
  Т.к. чаще всего использую browserify в browser-sync то что бы сервер не падал нужно обрабатывать
  ошибки. bundle даёт такую возможность
*/
 browserify({basedir: 'src/js/dev', entries: ['del.js','main.js']})
 .bundle((err, buf) =>{
   if(err){
     console.dir(err);
   }else{
     fs.createWriteStream('src/js/bundle.js').write(buf)
   }
 })

 /*
  1. browserify при сборке подключает 1 раз библиотеку к bundle не смотря на то что библиотека 
     могла быть подключена в нескольких js файлах, но при условии что подключён один и тот же файл библиотеки.
     Если в одном файле import 'jQuery', а в другом import "../../../node_modules/jquery/dist/jquery.slim";
     то файлы конкатенируются.

  2. import и request не могут подключать файл min.js версии. Так что найти в node_modules библиотеку и подключить её 
     сжатую версию не получиться
 */
/*######------<{ Gulp и browserify }>--------######### */
/*
без Gulp
  Если хочется что бы browserify работал с gulp.dest и создал файл где указываем пусть через .pipe(gulp.dest('src/js')),
  то нужно скачать vinyl-source-stream и перед путём закинуть в .pipe(source('bundle.js')),
  но вообще-то в browserify а именно метод bundle принимает callback и ни dest ни source не нужны

  кстате 
*/
function gluingJS() {
  let jsFile = fs.readdirSync('src/js/dev');
  return (
    browserify({
      entries: jsFile,
      basedir: "src/js/dev",
      debug: true,
    })
    .transform(babelify, {
      presets: ['@babel/preset-env'],
    })
    .bundle((err, buffer) => {
      let event = new EventEmitter();
      if (err) {
        event.emit('error',err)
      }
      else {
        let data = minify(buffer.toString(), {}).code;
        fs.createWriteStream('./src/js/bundle.js').write(data)
        bs.reload()
      } 
    })
  )
}


browserify()
//методы
.ignore('имя пакета')/*даже если подключили его в файл через import он не добавиться в bundle  */
.require('имя пакета')/*Добавляет сразу пакет в bundle, но это не даёт право использовать код пакета без её вызова
                        import имя from "имя пакета". Что странно вроде пакет уже в bundle и надежда была на то что 
                        может быстрей будет пересобираться bundle но нет. ниже подключения bundle использовать в script
                        методы пакета так же без подключения не будут работать */
/*
При попытке связать browserify и uglifyJS получаем, фигню.
1. файл не минифицирован и debug включает карты в base64
    ...
  '//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluMS5qcyIsIm1haW4yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVo7Ozs7O0FDQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc29sZS5kaXIoMTYzNClcclxuIiwiY29uc29sZS5kaXIoMTg1KSJdfQ==\n'

2. закидываем только данные в minify и пробуем включить карты от uglify если укажем 
    sourceMap: { filename: '../bundle.min.js', url: 'sourcemap/bundle.min.js.map' } получим это      
 {
  code: `!function t(o,i,u){function f(e,r){if(!i[e]){if(!o[e]){var n="function"==typeof require&&require;if(!r&&n)return n(e,!0);if(c)return c(e,!0);throw(n=new Error("Cannot find module '"+e+"'")).code="MODULE_NOT_FOUND",n}n=i[e]={exports:{}},o[e][0].call(n.exports,function(r){return f(o[e][1][r]||r)},n,n.exports,t,o,i,u)}return 
i[e].exports}for(var c="function"==typeof require&&require,r=0;r<u.length;r++)f(u[r]);return f}({1:[function(r,e,n){"use strict";console.dir(1634)},{}],2:[function(r,e,n){"use strict";console.dir(185)},{}]},{},[1,2]);\n` +    '//# sourceMappingURL=sourcemap/bundle.min.js.map',
  map: '{"version":3,"file":"../bundle.min.js","sources":["0"],"names":["r","e","n","t","o","i","f","c","require","u","a","Error","code","p","exports","call","length","1","module","console","dir","2"],"mappings":"CAAY,SAASA,EAAEC,EAAEC,EAAEC,GAAG,SAASC,EAAEC,EAAEC,GAAG,IAAIJ,EAAEG,GAAG,CAAC,IAAIJ,EAAEI,GAAG,CAAC,IAAIE,EAAE,mBAAmBC,SAASA,QAAQ,IAAIF,GAAGC,EAAE,OAAOA,EAAEF,GAAE,GAAI,GAAGI,EAAE,OAAOA,EAAEJ,GAAE,GAAkD,MAA1CK,EAAE,IAAIC,MAAM,uBAAuBN,EAAE,MAAaO,KAAK,mBAAmBF,EAAMG,EAAEX,EAAEG,GAAG,CAACS,QAAQ,IAAIb,EAAEI,GAAG,GAAGU,KAAKF,EAAEC,QAAQ,SAASd,GAAoB,OAAOI,EAAlBH,EAAEI,GAAG,GAAGL,IAAeA,IAAIa,EAAEA,EAAEC,QAAQd,EAAEC,EAAEC,EAAEC,GAAG,OAAOD,EAAEG,GAAGS,QAAQ,IAAI,IAAIL,EAAE,mBAAmBD,SAASA,QAAQH,EAAE,EAAEA,EAAEF,EAAEa,OAAOX,IAAID,EAAED,EAAEE,IAAI,OAAOD,EAA7b,CAA4c,CAACa,EAAE,CAAC,SAAST,EAAQU,EAAOJ,gBAGxeK,QAAQC,IAAI,OAEV,IAAIC,EAAE,CAAC,SAASb,EAAQU,EAAOJ,gBAGjCK,QAAQC,IAAI,MAEV,KAAK,GAAG,CAAC,EAAE"}'
}
в map: sources":["0"] это значит нет указания на файл. Короче можно дальше ковырять или проще gulp использовать или карты в base64 + 'babel-preset-minify'

*/
/* с Gulp. */