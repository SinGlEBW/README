/*#########----------<{ Использование через командную строку }>---------########### */
/*
  Что бы использовать командную строку нужно ставить пакет глобально
  uglify работает только с ES5.есть uglify-es6, но зачем если есть babelify которая переводит в es5
  uglifyjs --compress --mangle -- input.js

*/
const { minify } = require('uglify-js');
const uglify = require('gulp-uglify');
let code = 'Код переводит только ES5'

let result = minify(code, option)

option = {
  toplevel: false, // Если хотим чт бы переменные тоже сокращались то true
  sourceMap: {
    filename: "out.js",
    url: "out.js.map"
} // передать объект, если вы хотите указать параметры исходной карты. 
}

/*######--------<{ Попытки поработать с GULP }>-------#########*/
/*
С Gulp нормально поработать библиотеками особо не получиться т.к. он обрабатывает их иначе.
то src будет не тему, то dest не будет работать с библиотекой. Он в основном работает через pipe,
а нам нужно самим получать данные и обрабатывать, поэтому нужно будет напрямую работать с потоками.
Как по мне решаемо и удобней. Вот замечания при попытке поработать с Gulp.

  Мало того что gulp-uglify не работает без vinyl-buffer так ещё и 
  вырезает карты которые добавляем через debug: true, и их в нём не включить.
  Ну ещё до кучи gulp.dest не будет работать с файлом полученным через
  browserify нужно ставить vinyl-source-stream
*/
browserify({
  entries: jsFile,
  basedir: "src/js/dev",
  debug: true,
})
.transform(babelify, {
  presets: ['@babel/preset-env'],
})
.bundle()
.pipe(source('bundle.js'))//vinyl-source-stream
.pipe(buffer())//uglify не заводиться без vinyl-buffer
.pipe(uglify())
.pipe(dest('src/js'))
.pipe(bs.reload({stream: true}))

/*
  Что бы вернуть карты нужна очередная библиотека gulp-sourcemap. Зачем карты? html ссылается на bundle, если там возникает ошибка то найти 
  строчку не реально, нам бы знать к какому файлу относиться эта строка и где она есть. Вот sourceMap это и отображает в DevTool
*/
return (
  browserify({
    entries: jsFile,
    basedir: "src/js/dev",
    debug: true,//это уже не имеет смысла
  })
  .transform(babelify, {
    presets: ['@babel/preset-env'],
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())//uglify не заводиться без vinyl-buffer
  .pipe(sourcemaps.init({
    // loadMaps: true,
  }))
  .pipe(uglify())//удалил карты
  .pipe(sourcemaps.write('./sourcemap'))
  .pipe(dest('src/js'))
  .pipe(bs.reload({stream: true}))
)