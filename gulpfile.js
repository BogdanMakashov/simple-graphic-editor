const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const gulpEjsMonster = require('gulp-ejs-monster');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const webpack = require('webpack-stream');
const removeEmptyLines = require('gulp-remove-empty-lines');
const htmlbeautify = require('gulp-html-beautify');
const autoprefixer = require('gulp-autoprefixer');
const lessPluginGlob = require('less-plugin-glob');

const browserSync = require('browser-sync').create();

const sourceDir = './src';
const distDir = './build';

gulp.task('ejs:build', () => gulp.src(`${sourceDir}/pages/*.ejs`)
    .pipe(gulpEjsMonster({/* plugin options */}))
    .pipe(removeEmptyLines({
        removeComments: true,
    }))
    .pipe(htmlbeautify({
        'indent_size': 4,
    }))
    .pipe(gulp.dest(`${distDir}/`)));

gulp.task('js:build', () => {
    process.env.webpackWatch = false;

    return gulp.src(`${sourceDir}/js/index.js`)
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest(`${distDir}/js/`));
});

gulp.task('style:build', () => gulp.src(`${sourceDir}/less/index.less`)
    .pipe(less({
        plugins: [lessPluginGlob],
    }))
    .pipe(autoprefixer({
        cascade: false,
    }))
    .pipe(gulp.dest(`${distDir}/css/`)));

gulp.task('image:build', () => gulp.src(`${sourceDir}/images/**/*`)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true,
    }))
    .pipe(gulp.dest(`${distDir}/images/`)));

gulp.task('fonts:build', () => gulp.src(`${sourceDir}/fonts/**/*`)
    .pipe(gulp.dest(`${distDir}/fonts/`)));

gulp.task('files:build', () => gulp.src(`${sourceDir}/files/**/*`)
    .pipe(gulp.dest(`${distDir}/files/`)));

// gulp.task('favicon:build', () => gulp.src(`${sourceDir}/favicon.ico`)
//     .pipe(gulp.dest(`${distDir}/`)));

gulp.task('webserver', () => {
    browserSync.init({
        server: './build',
        stream: true,
        port: 3001,
    });
    browserSync.watch('./build').on('change', browserSync.reload);
});

gulp.task('clean', cb => rimraf(path.clean, cb));

gulp.task(
    'build',
    gulp.series(gulp.parallel('ejs:build', 'js:build', 'style:build', 'fonts:build', 'image:build', 'files:build')),
);

gulp.task('watch', () => {
    gulp.watch(`${sourceDir}/layouts/*`, gulp.series('ejs:build'));
    gulp.watch(`${sourceDir}/htmlBlocks/*`, gulp.series('ejs:build'));
    gulp.watch(`${sourceDir}/pages/*`, gulp.series('ejs:build'));
    gulp.watch(`${sourceDir}/less/**/*.less`, gulp.series('style:build'));
    gulp.watch(`${sourceDir}/js/**/*.js`, gulp.series('js:build'));
    gulp.watch(`${sourceDir}/images/**/*`, gulp.series('image:build'));
    gulp.watch(`${sourceDir}/fonts/**/*`, gulp.series('fonts:build'));
    gulp.watch(`${sourceDir}/files/**/*`, gulp.series('files:build'));
});

gulp.task(
    'default',
    gulp.series(gulp.parallel('build', 'webserver', 'watch')),
);
