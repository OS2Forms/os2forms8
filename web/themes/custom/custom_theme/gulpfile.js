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
const styles = require('gulp-sass')(require('sass'));
const del = require('del');
const modernizr = require('gulp-modernizr');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');


// Processors
function processModernizr() {
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
}
function processStyles() {
    return gulp.src(compileConfig.settings.styles)
        .pipe(sourcemaps.init())
        .pipe(styles({
            quietDeps: true,
            silenceDeprecations: ['legacy-js-api', 'import', 'slash-div', 'global-builtin', 'color-functions', 'if-function']
        }).on('error', swallowError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/stylesheets'))
        .pipe(browserSync.stream({match: '**/*.css'}));
}
function processJavascripts() {
    return gulp.src(compileConfig.settings.javascripts)
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/javascripts'));
}
function processFonts() {
    return gulp.src(compileConfig.settings.fonts)
        .pipe(gulp.dest('dist/fonts'));
}


// Cleaners
function cleanModernizr() {
    return del(['dist/javascripts/modernizr.js']);
}
function cleanStyles() {
    return del(['dist/stylesheets']);
}
function cleanJavascripts() {
    return del(['dist/javascripts/*.js', '!dist/javascripts/modernizr.js']);
}
function cleanFonts() {
    return del(['dist/fonts']);
}


// Reloaders
function reloadJavascripts(done) {
    browserSync.reload();
    done();
}
function reloadFonts(done) {
    browserSync.reload();
    done();
}
function reloadTemplate(done) {
    browserSync.reload();
    done();
}


// Builders
const buildStyles = gulp.series(cleanStyles, processStyles);
const buildJavascripts = gulp.series(cleanJavascripts, processJavascripts);
const buildFonts = gulp.series(cleanFonts, processFonts);
const buildModernizr = gulp.series(
    gulp.parallel(buildJavascripts, buildStyles),
    cleanModernizr,
    processModernizr
);
const build = gulp.parallel(buildModernizr, buildFonts);


// Watch
function watch(done) {
    gulp.watch('src/styles/**/*.scss', buildStyles);
    gulp.watch('src/javascripts/**/*.js', gulp.series(buildJavascripts, reloadJavascripts));
    gulp.watch('src/fonts/**/*.+(eot|svg|ttf|woff|woff2)', gulp.series(buildFonts, reloadFonts));
    gulp.watch('**/*.+(twig|twig.html|tpl|tpl.php|html)', reloadTemplate);

    // Browser sync
    browserSync.init(['dist/stylesheets/*.css', 'dist/javascripts/*.js'], {
        proxy: gulpConfig.settings.options.proxy
    });
    done();
}


// Tasks
gulp.task('process:modernizr', processModernizr);
gulp.task('process:styles', processStyles);
gulp.task('process:javascripts', processJavascripts);
gulp.task('process:fonts', processFonts);
gulp.task('clean:modernizr', cleanModernizr);
gulp.task('clean:styles', cleanStyles);
gulp.task('clean:javascripts', cleanJavascripts);
gulp.task('clean:fonts', cleanFonts);
gulp.task('build:styles', buildStyles);
gulp.task('build:javascripts', buildJavascripts);
gulp.task('build:fonts', buildFonts);
gulp.task('build:modernizr', buildModernizr);
gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));
gulp.task('default', gulp.series(build, watch));
