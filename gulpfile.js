const fs = require('fs'),
    gulp = require('gulp'),
    path = require('path'),
    sass = require('gulp-sass'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    buffer = require('vinyl-buffer'),//из-за того что src в gulp не передаём требуется для uglify 
    browserify = require('browserify'),//не gulp версия
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    autoprefixer = require('gulp-autoprefixer'),
    uglifyES = require('gulp-uglify-es').default,
    browserSync = require('browser-sync').create();
      


gulp.task('nsmpscss', () => {
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/magnific-popup/dist/magnific-popup.css'
  ])
  .pipe(concat('_libs.scss'))
  .pipe(gulp.dest('app/css/scss'))
})

gulp.task('smpminjs', () => {
  return gulp.src([
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
      ]
  )
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
})
/*###-------------------Config---------------------###*/
// class Config{
//   constructor(params){
//     this.pathJSX = params.pathFolderJSX
//     this.pathJS = params.pathFolderJS
//     this.error = this.logError
//   }
//   files(pathFiles = null){
//     let dir = path.parse(pathFiles).dir;
//     let arrNameFile = fs.readdirSync(dir);
//     let arrFullPath = arrNameFile.map((item) => path.join(dir, item))
//     return arrFullPath;
//   }
//   dirFormat(pathFiles){
//     let dir = path.parse(pathFiles).dir.replace(/jsx/, 'src')
//     return dir
//   }
//   logError(err){
//     console.error(`ERROR >> ${err}`);
//     this.emit('end');
//   }
//   convertPath = (filePath) => filePath.map((item) => item.replace(/\\/g, '/'));//путь с \\ заменится на / для gulp.src
    
// }




class Config{
  constructor( params = {}){
   
    this.pathJSX = params.pathFolderJSX;
    this.pathJS = params.pathFolderJS;
    this.pathSCSS = params.pathFolderScss;
    this.pathFileJSX = this.files(this.pathJSX)
    this.pathFileSCSS = this.files(this.pathJSX)
    this.convPathJSX = this.convertPath(this.pathFileJSX);
  }

  files(pathFiles){
    
    
    if(typeof pathFiles == 'string' && path.parse(pathFiles).ext == '.jsx')
        return [pathFiles]  
    else
        return fs.readdirSync(this.pathJSX).map((item) => path.join(this.pathJSX, item))
   
  }
  convertPath(arrPathFiles){

    return arrPathFiles.map((item) => item.replace(/\\/g, '/'))
     
  }
  dirFormat(pathFiles){
    let dir = path.parse(pathFiles).dir.replace(/jsx/, 'src')
      return dir
  }
  logError(err){
    console.error(`ERROR >> ${err}`);
    this.emit('end');
  } 


  
}


let set = new Config({
  pathFolderJSX: 'app/React/jsx',
  pathFolderJS: 'app/React/src',
  pathFolderScss: 'app/css/scss',
  pathJSXfiles: 'app/React/**/**.jsx'
})


let myFunc = function(file){

    let arrPath =  fs.readdirSync(file) .map((item) => {
                    
      let value
      if(item.endsWith('.jsx')) 
          return item   
      else
          value = myFunc(path.join(file, item))
          value = value.join()
          
          return  path.join(item, value)   
      
      })
         
    return arrPath
          
}

let dd = myFunc('app/React/jsx').join().split(',')

console.dir(dd);




/*
  Нужно в передать 
  1. Путь к папке JSX
  2. Путь к папке JS

  Нужно получать информацию в свойствах 
  1. Массив путей непосредственно файлов 
  2. Конвертированый массив путей

  Метод должен создавать в папке JS те же папки что и в папке JSX

*/


/*-------Функции для стежки и отдельного выполнения таском--------------------*/

let reactJSX = async function(file){//для работы import в React
  
  let arrFullPath = await set.files(file);
  
  return await (
    arrFullPath.map((items) => {

      return (
        // файлы нужно не перебирать. Закинуть массив можно
        browserify(items).transform( babelify, {
            presets: ['@babel/preset-react','@babel/preset-env'],//
            plugins: [
              '@babel/plugin-proposal-class-properties',
            ]
        })
        .bundle()
        .on('error', set.logError)//При ошибке в js не разорвёт соединение в browserSync
        .pipe(source(path.parse(items).name))
        .pipe(rename({extname: '.min.js'}))
        .pipe(buffer())
        .pipe(sourcemaps.init({
          loadMaps: true,
        }))
        .pipe(uglify())
        .on('error', set.logError)
        .pipe(sourcemaps.write('./sourcemap'))
        .pipe(gulp.dest(set.pathJS))
        .pipe(browserSync.reload({stream: true})) )
    })  )     
}

let compress = function(){

  return (
    gulp.src('app/React/src/**.js')
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify()).on('error', function(err){
            console.error(`ERROR >> ${err}`);
            this.emit('end');
        })
      .pipe(gulp.dest('app/React/srcr')) )
}

let scssCSS = async function(file){
  
  
  
  return await (
    gulp.src(set.convertPath(arrFullPath))//
        .pipe(sass.sync({outputStyle: "compressed"}).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            cascade: false
        }))
        
        .pipe(rename({suffix: '.min'}))//переименовывает файл. можно и без rename за ранее писать в файле style.min.scss
        .pipe(gulp.dest('app/css/min'))//куда складывать
        .pipe(browserSync.reload({stream: true})) )
        //this.reload()//можно и так
}

/*###--Для отдельного использования тасков--###*/
gulp.task('reactJSX', reactJSX)
gulp.task('compress', compress)
gulp.task('scssCSS', scssCSS)
/*---------------------------------------------*/
gulp.task('default', () => {
  browserSync.init({
    server: { 
      baseDir: "app",
      directory: false, // показывает список файлов 
      //index: "/React/index.html",//не работает как ожидалось. ниже параметр startPath
      // serveStaticOptions: {
      //   extensions: ["html"]
      // }
    },
    watch: true,
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
});



/* ################---------browser-sync Заменяет это всё----------################ */
// gulp.task('scss', () => {
//   return gulp.src('app/css/scss/**/*.scss')//* это во всех папках/все файлы.scss
//     .pipe(sass.sync({outputStyle: "compressed"}).on('error', sass.logError))//зачем sync непонятно.
//     .pipe(autoprefixer({
//             overrideBrowserslist: ['last 10 versions'],
//             cascade: false
//     }))
//     .pipe(rename({suffix: '.min'}))//переменовывает файл. можно и без rename за ранее писать в файле style.min.scss
//     .pipe(gulp.dest('app/css'))//куда складывать
//     .pipe(browserSync.reload({stream: true}))
    
//   });
 /*
 В sass.sync() или в sass() передаёться объект с настройками вида компиляции
 {outputStyle: "compressed"}// "expanded" - обычный режим с отступами

 */
// gulp.task('html', () => {
//   return gulp.src("app/**/**/*.html")//"app/js/**/*.html"
//     .pipe(browserSync.reload({stream: true}))
// })
 
// gulp.task('php', () => {
//   return gulp.src("app/Lesson/**/*.php")
//     .pipe(browserSync.reload({stream: true}))
// })
    
// gulp.task('js', () => {
//   return gulp.src("app/js/**/*.js")
//     .pipe(browserSync.reload({stream: true}))
// })

// gulp.task('watch', () => {
//   gulp.watch('app/css/scss/**/*.scss',gulp.parallel('scss')) //gulp.parallel('scss')
//   gulp.watch("app/**/**/*.html",gulp.parallel('html'))//gulp.parallel('html')
//   gulp.watch('app/Lesson/**/*.php',gulp.parallel('php'))//gulp.parallel('php')
//   gulp.watch("app/js/**/*.js",gulp.parallel('js'))//gulp.parallel('js')
// })

// gulp.task('default', gulp.parallel('scss','browser-sync','watch'))


