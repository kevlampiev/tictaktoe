const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

function buildJs() {
    return gulp.src('./src/*.js') //это папка где у вас лежат js файлы
        .pipe(sourcemaps.init())
        .pipe(concat('app.js')) //это как будет называться собранный файл
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/')); //папка куда будем складывать наш файл
}

gulp.watch('./src/*.js', buildJs);

exports.default = buildJs;