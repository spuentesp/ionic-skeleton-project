(function() {
  'use strict';

  const gulp = require('gulp');
  const gutil = require('gulp-util');
  const gulpif = require('gulp-if');
  const bower = require('bower');
  const concat = require('gulp-concat');
  const sass = require('gulp-sass');
  const minifyCss = require('gulp-minify-css');
  const rename = require('gulp-rename');
  const sh = require('shelljs');
  const beautify = require('gulp-beautify');
  const uglify = require('gulp-uglify');
  const angularFilesort = require('gulp-angular-filesort');
  const inject = require('gulp-inject');
  const mainBowerFiles = require('gulp-main-bower-files');
  const ngAnnotate = require('gulp-ng-annotate');
  const htmlreplace = require('gulp-html-replace');


//QA-TOOLS
  const jshint = require('gulp-jshint');
  const eslint = require('gulp-eslint');
  const jscs = require('gulp-jscs');
  const sloc = require('gulp-sloc');
  const htmlhint = require('gulp-htmlhint');

//Setup analisis QA estático
  const codeBasePath = './www/js/**/*.js';
  const htmlBasePath = ['./www/templates/**/*.html', './www/index.html'];

  var paths = {
    sass: ['./scss/**/*.scss'],
    js: ['' +
    './js/*.js',
      './js/endpoints/*.js',
      './js/translations/*.js',
      './js/modules/*.js',
      './js/modules/**/*.js',
      './js/global/*.js',
      './js/providers/*.js',
      './js/providers/**/*.js',
      './js/services/*.js',
      './js/services/**/*.js',
      './js/controllers/**/*.js']
  };

  gulp.task('default', ['watch']);

  gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(gulp.dest('./www/css/'))
      .pipe(minifyCss({
        keepSpecialComments: 0
      }))
      .pipe(rename({extname: '.min.css'}))
      .pipe(gulp.dest('./www/css/'))
      .on('end', done);
  });

  gulp.task('watch', ['dev'], function () {
    gulp.watch(paths.sass, ['sass']);
    //gulp.watch(paths.js,['dev'])
  });

  gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
      .on('log', function (data) {
        gutil.log('bower', gutil.colors.cyan(data.id), data.message);
      });
  });

  gulp.task('git-check', function (done) {
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

  /***copia las librerias de bower components a lib***/
  gulp.task('clean-bower', function (done) {
    return gulp.src('./bower.json')
      .pipe(mainBowerFiles({
        includeDev: true,
        overrides: {
          ionic: {
            main: [
              'fonts/*',
              'css/ionic.css',
              'scss/*.scss',
              'scss/**/*.scss',
              'js/ionic.bundle.js'
            ]
          },
          'angular-i18n': {
            main: [
              'angular-locale_es-cl.js'
            ]
          }
        }
      }))
      //
      .pipe(gulp.dest('./www/lib/'))
  });

  gulp.task('inject', ['clean-bower'], function (done) {
    var target = gulp.src('index.html', {cwd: './www'});
    var sources = gulp.src(
      ['./lib/ionic/**/*.js', './lib/**/*.js'], {base: './lib', cwd: './www'});
    return target
      .pipe(inject(sources, {name: 'bower', relative: true}))
      .pipe(gulp.dest('./', {cwd: './www'}))
  });


  gulp.task('inject-project', ['inject'], function () {
    var target = gulp.src('index.html', {cwd: './www'});
    var sources = gulp.src(paths.js, {base: './js', cwd: './www'});
    return target
      .pipe(inject(sources.pipe(angularFilesort()), {name: 'proyecto', relative: true}))
      .pipe(gulp.dest('./', {cwd: './www'}))
  });


  gulp.task('beautify', ['inject-project'], function (done) {
    var sources = gulp.src(paths.js, {base: './js', cwd: './www'});

    return sources.pipe(beautify({indent_size: 2}))
      .pipe(gulp.dest('./js/'))
  });

  gulp.task('dev', ['beautify']);


  /***task para release***/
  gulp.task('release-prepare', ['inject'], function () {
    var sources = gulp.src(paths.js, {base: './js', cwd: './www'});
    return sources
      .pipe(angularFilesort())
      .pipe(ngAnnotate({single_quotes: true}))
      .pipe(concat('app.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./', {cwd: './www'}))
  });


  gulp.task('release', ['release-prepare'], function (done) {
    return gulp.src('index.html', {cwd: './www'})
      .pipe(htmlreplace({
        'js': {
          src: ['app.min.js'],
          tpl: '<!-- build:js --> \n' +
          '<!-- proyecto:js --> \n ' +
          '<script src="%s"></script>\n' +
          '<!-- endinject -->\n' +
          '<!-- endbuild -->\n'
        }
      }))
      .pipe(gulp.dest('./', {cwd: './www'}))
  });


  /****TESTING***/

  var Server = require('karma').Server;

  gulp.task('test', function (done) {
    new Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
    }, done).start()
  });

//***********************************************************************//
  //*************************START QA**************************************//

  //QA-TASKS

  //Global Task
  function isFixed(file) {
    // Has ESLint fixed the file contents?
    return file.eslint != null && file.eslint.fixed;
  }

  gulp.task('jshint', function () {
    return gulp.src(codeBasePath)
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
  });
  gulp.task('eslint', function () {
    return gulp.src(codeBasePath)
      .pipe(eslint('.eslintrc'))
      .pipe(eslint.format())
      .pipe(gulp.dest('./lintfixes/'));
  });
  gulp.task('checkstyle', function () {
    return gulp.src(codeBasePath)
      .pipe(jscs({
        configFile: '.jscsrc',
        fix: true
      }))
      .pipe(jscs.reporter());
  });
  gulp.task('sloc', function () {
    return gulp.src(codeBasePath)
      .pipe(sloc());
  });
  gulp.task('htmlhint', function () {
    return gulp.src(htmlBasePath)
      .pipe(htmlhint('.htmlhintrc'))
      .pipe(htmlhint.reporter());
  });

  /*HTML*/
  gulp.task('qaHtml', ['htmlhint']);

  //*************************END QA **************************************//
  //***********************************************************************//

  gulp.task('qa', ['eslint']);

})();
