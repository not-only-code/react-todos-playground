// global variables
var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    port = process.env.port || 3031;

// browserify + reactify + uglify
gulp.task('browserify', function() {
    gulp.src('./app/src/js/main.js')
      .pipe(browserify({transform: 'reactify'}))
      .pipe(uglify())
      .pipe(gulp.dest('./app/dist/js'));
});

// cleanup /dist folder
gulp.task('clean', function() {
  del('./app/dist');
});

// concat todomvc css as base.css
gulp.task('css', function() {
  gulp.src(['./node_modules/todomvc-common/base.css', 'node_modules/todomvc-app-css/index.css'])
    .pipe(concat('todos.css'))
    .pipe(gulp.dest('./app/dist/css/'));

});

// initialize browserSync at http://localhost:3031
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './app'
    },
    host: 'localhost',
    port: port,
    open: false
  });
});

// watch files for live reload
gulp.task('watch', function() {
    gulp.watch('app/dist/js/*.js').on('change', browserSync.reload);
    gulp.watch('app/index.html').on('change', browserSync.reload);
    gulp.watch('app/src/js/**/*.js', ['browserify']);
});

gulp.task('default', ['clean', 'browserify', 'css']);

gulp.task('serve', ['default', 'browser-sync', 'watch']);