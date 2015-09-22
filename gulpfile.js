// global variables
var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    port = process.env.port || 3031;

// cleanup /dist folder
gulp.task('clean', function(cb) {
  del(['./app/dist'], cb);
});

// concat todomvc css as base.css
gulp.task('css', function() {
  gulp.src(['./node_modules/todomvc-common/base.css', 'node_modules/todomvc-app-css/index.css'])
    .pipe(concat('todos.css'))
    .pipe(gulp.dest('./app/dist/css/'));
});

// browserify + reactify + uglify
gulp.task('browserify', function() {
    gulp.src('./app/src/js/main.jsx')
      .pipe(browserify({
        transform: 'reactify',
        extensions: [ ".jsx" ]
      }))
      .pipe(rename('main.js'))
      .pipe(gulp.dest('./app/dist/js'));
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
    gulp.watch('./app/dist/js/*.js').on('change', browserSync.reload);
    gulp.watch('./app/index.html').on('change', browserSync.reload);
    gulp.watch('./app/src/js/**/*.jsx', ['browserify']);
});

// tasks
gulp.task('default', ['clean', 'browserify', 'css']);
gulp.task('serve', ['default', 'browser-sync', 'watch']);