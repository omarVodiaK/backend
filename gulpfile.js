var gulp = require('gulp');
var connect = require('gulp-connect');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var modRewrite = require('connect-modrewrite');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var ngAnnotate = require('gulp-ng-annotate');
var inject = require("gulp-inject");
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var removeEmptyLines = require('gulp-remove-empty-lines');

//less and js files paths are relative to gulpfile.js folder
var lessFiles = 'app/assets/styles/less/*';
var cssDestination = 'build/assets/styles/css';
var jsFiles = {
    jsSrc: [
        'app/app.config.js',
        'app/app.routes.js',
        'app/app.services.js',
        'app/app.js',
        'app/app.core.js',
        'app/services/RequestFactory.js',
        'app/services/SessionService.js',
        'app/services/ShowFactory',
        'app/modules/**/*.js',
        'app/components/layout/sections/*.js',
        'app/directives/*.js',
        'app/directives/angular-bootstrap-nav-tree-js/dist/abn_tree_directive.js'],
    jsDist: 'app/dist/scripts'
};

gulp.task('compile-to-less-styles', function () {

    gulp.src(lessFiles) // pass the location of all less files.
        .pipe(concat('master.min.css'))
        .pipe(less()) // use .pipe() to pass anything returned from .src() into less() parser function to compile it to CSS.
        .pipe(gulp.dest(cssDestination)); // use .pipe() to send the results from the previous function into gulp.dest(), which saves the compiled CSS files to the newly defined location.
});

gulp.task('scripts', function () {
    return gulp.src(jsFiles.jsSrc) // grab location of js files.
        .pipe(concat('scripts.js')) // use .pipe() to stream the source data to the concat() module.
        .pipe(rename('scripts.min.js')) // give minified file name.
        .pipe(removeEmptyLines()) //Remove empty lines.
        // .pipe(uglify({ // uglify generated file.
        //     options: {
        //         beautify: false,
        //         mangle: false
        //     }
        // }))
        .pipe(gulp.dest(jsFiles.jsDist)); // location where the new minified and uglified files will generated.
});

//Minify, concatenate and version CSS and JS
//Use ngAnnotate to take care of Angular inject issues
gulp.task('usemin', function () {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat', rev()],
            js: [ngAnnotate(), uglify(), rev()],
            assets: [rev()]
        }))
        .pipe(gulp.dest('build/'));
});

//Delete the temporary templates module file and remove the include from ./app/index.html
// gulp.task('clean', ['usemin'], function () {
//     gulp.src('./app/app.templates.js', {read: false})
//         .pipe(clean());
//     gulp.src('./app/index.html')
//         .pipe(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$1$6'))
//         .pipe(gulp.dest('app/'));
//     gulp.src(['build/*.*'], {read: false})
//         .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
//         .pipe(clean());
// });

//Start a web server on port 8283 to server the app webapp
gulp.task('connect-dev', function () {

    connect.server({
        root: 'app/',
        port: 8283,
        middleware: function (connect, opt) {
            return [
                modRewrite([
                    '^/api/(.*)$ http://localhost:3002/api/$1 [P]',
                    '^/cdn/upload/(.*)$ http://128.199.125.79:3008/cdn/upload/$1 [P]',
                    '^/cdn/download/(.*)$ http://128.199.125.79:3008/cdn/download/$1 [P]'
                ])
            ]
        }
    });
});

gulp.task('watch-less', function () {

    gulp.watch(lessFiles, ['compile-to-less-styles']);
});

//Default task which simply servers the source files
gulp.task('default', ['connect-dev', 'compile-to-less-styles', 'scripts']);