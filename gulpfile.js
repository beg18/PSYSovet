var gulp = require('gulp'),
    less = require('gulp-less'),
    prefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    run = require("run-sequence")
    replace = require('gulp-replace'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    rimraf = require('rimraf'),
    gcmq = require('gulp-group-css-media-queries'),
    browserSync = require('browser-sync').create();


var path = {
    // Откуда брать исходники
    src: {
        html:   'src/*.html',
        js:     'src/js/*.js',
        css:    'src/css/+(style|styles-percentage|styles-ie).less',
        allimg: 'src/i/**/*.*',
        img:    'src/i/**/*.{png,jpg}',
        svg:    'src/i/**/*.svg',
        fonts:  'src/css/fonts/**/*.*'
    },
    // Куда складывать готовые файлы после сборки
    build: {
        html:   'build/',
        js:     'build/js/',
        css:    'build/css',
        allimg: 'build/i/',
        img:    'build/i/',
        svg:    'build/i/',
        fonts:  'build/css/fonts/'
    },
    // За изменениями каких файлов мы хотим наблюдать
    watch: {
        html:   'src/**/*.html',
        js:     'src/js/*.js',
        css:    'src/css/**/*.less',
        allimg: 'src/i/**/*.*',
        img:    'src/i/**/*.{png,jpg}',
        svg:    'src/i/**/*.svg',
        fonts:  'src/css/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('css:build', function () {
    // Выберем наш style.less
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        // Скомпилируем
        .pipe(less())
        .pipe(gcmq())
        // Добавим вендорные префиксы
        .pipe(prefixer({
           browsers: ['last 2 version']
        }))
        // Сожмем
        .pipe(cssnano({zindex: false}))
        .pipe(sourcemaps.write())
        // Переместим в build
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('html:build', function () {
    // Выберем файлы по нужному пути
    gulp.src(path.src.html)
        // Прогоним через rigger
        .pipe(rigger())
        // Переместим их в папку build
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('js:build', function () {
    // Выберем файлы по нужному пути
    gulp.src(path.src.js)
        // Прогоним через rigger
        .pipe(rigger())
        // Сожмем js
        .pipe(uglify())
        // Переместим готовый файл в build
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('allimg:build', function () {
     gulp.src(path.src.allimg)
     // Переместим в build
    .pipe(gulp.dest(path.build.allimg))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('image:build', function () {
    // Выберем наши картинки
    gulp.src(path.src.img)
      // Сожмем их
    .pipe(imagemin([
        imagemin.jpegtran({progressive: true}),
        imageminJpegRecompress({
            loops: 5,
            min: 65,
            max: 70,
            quality: 'medium'
        }),
        imagemin.optipng({optimizationLevel: 3}),
        pngquant({quality: '65-70', speed: 5})
    ]))
    // Переместим в build
    .pipe(gulp.dest(path.build.img))
});

gulp.task('svg:build', function () {
    gulp.src(path.src.svg)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(path.build.svg));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
    // Переместим шрифты в build
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('gcmd:build', function(){
    gulp.src(path.src.css)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'css:build',
    'allimg:build',
    'image:build',
    'svg:build',
    'fonts:build',
    'gcmd:build'
]);




gulp.task('watch' , function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });

    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.svg], function(event, cb) {
        gulp.start('svg:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('gcmd:build');
    });
});

/*
gulp.task('watch', 'browserSync', function() {

});

gulp.task('serve', function () {
    browserSync.init({
        server: "build"
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: path.build
        },
        //tunnel: true
    });
});
 */



gulp.task('default', [ 'build', 'watch']);
