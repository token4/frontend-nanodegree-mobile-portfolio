/*eslint-env node */

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gzip = require('gulp-gzip');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');



gulp.task('default', ['copy-html', 'copy-images', 'lint', 'styles'], function () {
    gulp.watch('./*.html', ['copy-html']);
    gulp.watch('js/**/*.js', ['lint']);
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('./dist/index.html')
        .on('change', browserSync.reload);

    browserSync.init({
        server: './dist'
      });
  });

gulp.task('dist', ['copy-html', 'copy-images', 'lint', 'styles', 'scripts-dist']);

gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
      return gulp.src(['js/**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
          .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
          .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
          .pipe(eslint.failAfterError());
});

gulp.task('copy-html', function() {
    gulp.src('./*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-images', function() {
    gulp.src('img/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
          }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('imagemin', function() {
    gulp.src('img/*')
})

gulp.task('scripts', function() {
    gulp.src('js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'));

});

gulp.task('scripts-dist', function() {
    gulp.src('js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gzip())
        .pipe(gulp.dest('dist/js'));

});


gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(gulp.dest('dist/css'));
});
