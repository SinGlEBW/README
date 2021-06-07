/* 
  таск-менеджер
  Если возникает вопрос Что лучше node-sass или gulp sass, то ответ такой: gulp использует под капотом
   node-sass, а node-sass использует lib-sass которая вроде как написана на C или C++. Если не использую Gulp то просто 
   установить node-sass т.к. без лишнего мусора. Ну а с Gulp конечно его же библиотеку gulp-sass */

const gulp = require('gulp');
const sass = require('gulp-sass');
 
sass.compiler = require('node-sass');//такой конструкции я ещё не видел. видимо если не передать работать не будет
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))//если сильно захочется можно sass().sync().on(..) синхронно за компилировать 
    .pipe(sourcemaps.write('./maps'))//для полного фарша подключив карты их можно так установить
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});




gulp.task('watch', () => {
  gulp.watch('путь отслеживаемого файла(ов)',gulp.parallel('scss')) ;
  gulp.watch("app/**/**/*.html",gulp.parallel('html'));
  gulp.watch('app/Lesson/**/*.php',gulp.parallel('php'));
  gulp.watch("app/js/**/*.js",gulp.parallel('js'));
})