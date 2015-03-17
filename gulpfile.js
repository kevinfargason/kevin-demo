// gulp
var gulp = require('gulp');
var debug = require('gulp-debug');
var config = require('./gulp.config.json');

// build
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var sequence = require('run-sequence').use(gulp);

//workflow
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

// tasks
gulp.task('lint', function() {
  gulp.src([config.src.js + '/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    return gulp.src('./dist/**/*', {read: false})
      .pipe(clean({force: true}));
});
gulp.task('sass', function(callback){
     return gulp.src([config.src.sass + '/app.scss'])
    // .pipe(debug())
    .pipe(sass())
    .pipe(gulp.dest(config.dist.css));
});

gulp.task('app-css', ['sass'],function() {
  var opts = {comments:true,spare:true};
  gulp.src([config.dist.css + '/*'])
    .pipe(minifyCSS(opts))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest(config.dist.css))
});

gulp.task('lib-css', ['sass'],function() {
  var opts = {comments:true,spare:true};
  gulp.src([config.dist.css + '/*'])
    .pipe(minifyCSS(opts))
    .pipe(rename('lib.min.css'))
    .pipe(gulp.dest(config.dist.css))
});

gulp.task('build-js', function(){
  return gulp.src(config.src.js + '/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
});

// gulp.task('build-js', function() {
//   gulp.src([config.src.js + '/**/*.js'])
//     .pipe(concat)
//     .pipe(uglify({
//       mangle: false,
//       compress: false,
//       output: {
//         beautify: true
//       }
//       // inSourceMap:
//       // outSourceMap: "app.js.map"
//     }))
//     .pipe(gulp.dest('./dist/js'))
// });

gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(livereload());
});
gulp.task('copy-libs', function () {
  gulp.src('./app/lib/**/*')
    .pipe(gulp.dest('dist/lib/'));
});
gulp.task('copy-img', function () {
  gulp.src('./app/img/**/*')
    .pipe(gulp.dest('dist/img/'));
});
gulp.task('copy-data', function () {
  gulp.src('./app/data/**/*')
    .pipe(gulp.dest('dist/data/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 5000
  });
});

gulp.task('debug', function () {
    return gulp.src('./app/sass/_payload.scss')
        .pipe(debug({title: 'unicorn:'}))
        .pipe(gulp.dest('dist'));
});
 
gulp.task('watch', ['run'], function () {
    livereload.listen({ basePath: 'dist'});
    gulp.watch('app/**/*.*', function () {
        gulp.start('build');
        // .pipe('livereload');
    });
});

gulp.task('livereload', function(){
  livereload();
});

// default task
gulp.task('default', ['build']);

// gulp.task('dev', ['run', 'livereload', 'watch']);

//run the app
gulp.task('run', ['connectDist']);

// subtask for copying files
gulp.task('copy', 
  ['copy-html-files', 'copy-libs', 'copy-data', 'copy-img']
);

// build task
gulp.task('build',
  [ 'lint', 'app-css', 'lib-css','build-js', 'copy', 'livereload']
);