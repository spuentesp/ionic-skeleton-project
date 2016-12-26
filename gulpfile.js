var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var beautify = require('gulp-beautify');
var uglify = require('gulp-uglify');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var mainBowerFiles = require('gulp-main-bower-files');
var ngAnnotate = require('gulp-ng-annotate');
var htmlreplace = require('gulp-html-replace');

var paths = {
  sass: ['./scss/**/*.scss'],
  js:['./www/js/**/*.js']
};
var specificPath = '';

gulp.task('default', ['dev','watch']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch',  function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js).on('change', function (file) {
    gulp.task('dev');
  });
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('clean-bower', function(){
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles({
      includeDev: true,
      overrides: {
        ionic: {
          main: [
            'fonts/*',
            'css/*',
            'scss/**/*.scss',
            'scss/*.scss',
            'js/ionic.bundle.js'
          ]
        },
        angular:{
          main: [
          ]
        }
      }
    }))
    //
    .pipe(gulp.dest('./www/lib/'));
});

gulp.task('inject', ['clean-bower'], function(){
  var target = gulp.src('index.html', {cwd: './www'});
  var sources = gulp.src(
    ['./lib/ionic/**/*.js', './lib/**/*.js'], {base: './lib', cwd: './www'});
  return target.pipe(inject(sources, {name: 'bower', relative: true}))
    .pipe(gulp.dest('./', {cwd: './www'}));
});



gulp.task('inject-project', ['inject'], function(){
  var target = gulp.src('index.html', {cwd: './www'});
  var sources = gulp.src(['' +
    './js/modules/*.js',
    './js/modules/**/*.js',
    './js/global/*.js',
    './js/global/**/*.js',
    './js/providers/**/*.js',
    './js/factories/**/*.js',
    './js/controllers/**/*.js'], {base: './js', cwd: './www'});
  return target
    .pipe(inject(sources.pipe(angularFilesort()), {name: 'proyecto', relative: true}))
    .pipe(gulp.dest('./', {cwd: './www'}));
});

gulp.task('beautify', ['inject-project'], function(){
  gulp.src(['' +
  './js/modules/*.js',
    './js/modules/**/*.js',
    './js/global/*.js',
    './js/global/**/*.js',
    './js/providers/**/*.js',
    './js/factories/**/*.js',
    './js/controllers/**/*.js'])
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('./js/'))
});

gulp.task('dev',['beautify']);



/***task para release***/
gulp.task('release-prepare', function(done) {
  gulp.src(['' +
    './js/modules/*.js',
    './js/modules/**/*.js',
    './js/global/*.js',
    './js/global/**/*.js',
    './js/providers/**/*.js',
    './js/factories/**/*.js',
    './js/controllers/**/*.js'], {base: './js', cwd: './www'})
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(angularFilesort())
    .pipe(concat('miMovistar.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist', {cwd: './www'}))
    .on('end', done);
});


gulp.task('release',['release-prepare'],function(done){
  gulp.src('index.html', {cwd: './www'})
    .pipe(htmlreplace({
      'js': {
        src: ['dist/app.min.js'],
        tpl: '<!-- build:js --> \n' +
        '<!-- proyecto:js --> \n ' +
        '<script src="%s"></script>\n' +
        '<!-- endinject -->\n' +
        '<!-- endbuild -->\n'
      }
    }))
    .pipe(gulp.dest('./', {cwd: './www'}))
    .on('end', done);
});


