// Configurations
let compileConfig = {
    settings: require('./src/compile-settings.json')
};
let gulpConfig = {
    settings: require('./src/gulp-settings.json')
};


// Output the error to the terminal instead of dying out
function swallowError(error) {

    // If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}


// Load plugins
const gulp = require('gulp');
const babel = require('gulp-babel');
const styles = require('gulp-sass');
const del = require('del');
const modernizr = require('gulp-modernizr');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');


// Builders
gulp.task('build:modernizr', (callback) => {
    runSequence(['build:javascripts', 'build:styles'], 'clean:modernizr', 'process:modernizr', callback);
});
gulp.task('build:styles', (callback) => {
    runSequence('clean:styles', 'process:styles', callback);
});
gulp.task('build:javascripts', (callback) => {
    runSequence('clean:javascripts', 'process:javascripts', callback);
});
gulp.task('build:fonts', (callback) => {
    runSequence('clean:fonts', 'process:fonts', callback);
});


// Processors
gulp.task('process:modernizr', () => {
    return gulp.src(['dist/stylesheets/*.css', 'dist/javascripts/*.js', '!dist/javascripts/modernizr.js'])
        .pipe(modernizr({
            'cache': true,
            'uglify': true,
            'options': [
                'setClasses',
                'addTest',
                'html5printshiv',
                'testProp',
                'fnBind'
            ],
            excludeTests: [
                'hidden'
            ]
        }))
        .pipe(gulp.dest('dist/javascripts'));
});
gulp.task('process:styles', () => {
    return gulp.src(compileConfig.settings.styles)
        .pipe(sourcemaps.init())
        .pipe(styles().on('error', swallowError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/stylesheets'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});
gulp.task('process:javascripts', () => {
    return gulp.src(compileConfig.settings.javascripts)
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/javascripts'));
});
gulp.task('process:fonts', () => {
    return gulp.src(compileConfig.settings.fonts)
        .pipe(gulp.dest('dist/fonts'));
});


// Cleaners
gulp.task('clean:modernizr', () => {
    return del(['dist/javascripts/modernizr.js']);
});
gulp.task('clean:styles', () => {
    return del(['dist/stylesheets']);
});
gulp.task('clean:javascripts', () => {
    return del(['dist/javascripts/*.js', '!dist/javascripts/modernizr.js']);
});
gulp.task('clean:fonts', () => {
    return del(['dist/fonts']);
});


// Reloaders
gulp.task('reload:javascripts', () => {
    return browserSync.reload();
});
gulp.task('reload:fonts', () => {
    return browserSync.reload();
});
gulp.task('reload:template', () => {
    return browserSync.reload();
});


// Watchers
gulp.task('watcher:styles', (callback) => {
    runSequence('build:styles', callback);
});
gulp.task('watcher:javascripts', (callback) => {
    runSequence('build:javascripts', 'reload:javascripts', callback);
});
gulp.task('watcher:fonts', (callback) => {
    runSequence('build:fonts', 'reload:fonts', callback);
});
gulp.task('watcher:templates', (callback) => {
    runSequence('reload:template', callback);
});


// Tasks
gulp.task('default', (callback) => {
    runSequence('build', 'watch', callback);
});

gulp.task('watch', ['build'], () => {
    gulp.watch('src/styles/**/*.scss', ['watcher:styles']);
    gulp.watch('src/javascripts/**/*.js', ['watcher:javascripts']);
    gulp.watch('src/fonts/**/*.+(eot|svg|ttf|woff|woff2)', ['watcher:fonts']);
    gulp.watch('**/*.+(twig|twig.html|tpl|tpl.php|html)', ['watcher:templates']);

    // Browser sync
    browserSync.init(['dist/stylesheets/*.css', 'dist/javascripts/*.js'], {
        proxy: gulpConfig.settings.options.proxy
    });
});
gulp.task('build', (callback) => {
    runSequence(['build:modernizr', 'build:fonts'], callback);
});
