import gulp from "gulp";
import babel from "gulp-babel";
import sourcemaps from "gulp-sourcemaps";
const sass = require('gulp-sass')(require('sass'));
import minify from "gulp-minify";
import eslint from "gulp-eslint";
import cleanCSS from "gulp-clean-css";
import webpack from "webpack-stream";
import named from "vinyl-named";
import sassLint from "gulp-sass-lint";
import notifier from "node-notifier";

gulp.task('js', async () =>
    gulp.src('js/pages/*.js')
        .pipe(eslint())
        .pipe(eslint.failOnError())
        .pipe(eslint.result(result => {
            console.log(`ESLint result: ${result.filePath}`);
            console.log(`# Messages: ${result.messages.length}`);
            console.log(`# Warnings: ${result.warningCount}`);
            console.log(`# Errors: ${result.errorCount}`);
            for (const message of result.messages) {
                console.log(message);
            }
        }))
        .pipe(named())
        .pipe(webpack({
            watch: false,
            mode: 'none',
            output: {
                filename: '[name].js'
            }
        }))
        .pipe(babel())
        .pipe(minify(
            {
                ext:{
                    min:'.min.js'
                },
                ignoreFiles: []
            }
        ))
        .pipe(gulp.dest('dist'))
);

gulp.task('scss', () => {
    return gulp.src('scss/pages/*.scss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.dist'))
})

gulp.task('scss-main', () => {
    return gulp.src('scss/main.scss')
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
})

gulp.task('try-message', async () => {
    console.log('This is just a test message');
})

gulp.task('done-message', async () => {
    notifier.notify({
        title: 'Gulp',
        message: 'frontend build was finished'
    });
})

gulp.task('default', gulp.series('js', 'scss', 'scss-main', 'done-message'))

gulp.task('test', gulp.series('try-message', 'done-message'));