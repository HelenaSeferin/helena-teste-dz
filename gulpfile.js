var gulp            = require('gulp');
var browserify      = require('gulp-browserify');
var uglify          = require('gulp-uglify');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass');
var nunjucksRender  = require('gulp-nunjucks-render');
var streamqueue     = require('streamqueue');
var concat          = require('gulp-concat');
var rename          = require('gulp-rename');
var imagemin        = require('gulp-imagemin');

gulp.task('serve', ['sass', 'scripts', 'nunjucks', 'minifyImg' , 'js-watch'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("app/scss/**/*.scss", ['sass']);
    gulp.watch("app/js/*.js", ['js-watch']);
    gulp.watch("app/images/*.**", ['minifyImg']);
    gulp.watch("app/**/*.html", ['nunjucks']).on('change', browserSync.reload);
});

gulp.task('scripts', function() {
    return streamqueue({ objectMode: true },
        gulp.src('app/js/dependencies/jquery.js'),
        gulp.src('app/js/dependencies/bootstrap.js'),
        gulp.src('app/js/main.js')
    )
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('js-watch', ['scripts'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('sass', function() {
    return gulp.src("app/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/templates']
    }))
  .pipe(gulp.dest('dist'))
});

gulp.task('minifyImg', function() {
    gulp.src('app/images/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});

gulp.task('default', ['serve']);