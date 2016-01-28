var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var revOutdated  = require('gulp-rev-outdated');
var minifyCss = require('gulp-minify-css');
var ngHtml2Js = require("gulp-ng-html2js");
var inject = require("gulp-inject");
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var gulpAngularExtender = require('gulp-angular-extender');

//Convert all HTML tpl files to Angular template module
gulp.task('create-templates', function() {
    return gulp.src('./**/*.tpl.html')
        .pipe(ngHtml2Js({
            moduleName: "app.templates",
            rename: function(url) {
                return url.replace('app/', '');
            }
        }))
        .pipe(concat("app.templates.js"))
        .pipe(gulp.dest("app/"));
});

//Inject the templates file into ./app/index.html to be picked up by usemin
gulp.task('inject-templates', ['create-templates'], function() {
    return gulp.src('./app/index.html')
        .pipe(inject(gulp.src('./app/app.templates.js', {read: false}), {ignorePath: 'app', addRootSlash: false}))
        .pipe(gulp.dest('app/'));
});

//Minify, concatenate and version CSS and JS
//Use ngAnnotate to take care of Angular inject issues
gulp.task('usemin', ['inject-templates'], function() {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat', rev()],
            js: [ngAnnotate(), uglify(), rev()],
            assets: [rev()]
        }))
        .pipe(gulp.dest('build/'));
});

//Add Angular module dependency for templates
gulp.task('add-dependencies', ['usemin'], function () {
    gulp.src('build/app.min-*.js')
        .pipe(gulpAngularExtender({
            "app": [
                "app.templates"
            ]
        }))
        .pipe(gulp.dest('build/'));
});

//Copy the asset files from app to build
gulp.task('copy-asset-files', function() {
    gulp.src(['./app/assets/fonts/*']).pipe(gulp.dest('build/assets/fonts/'));
    gulp.src(['./app/assets/images/*']).pipe(gulp.dest('build/assets/images/'));
});

//Delete the temporary templates module file and remove the include from ./app/index.html
gulp.task('clean', ['usemin'], function () {
    gulp.src('./app/app.templates.js', {read: false})
        .pipe(clean());
    gulp.src('./app/index.html')
        .pipe(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$1$6'))
        .pipe(gulp.dest('app/'));
    gulp.src(['build/*.*'], {read: false})
        .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
        .pipe(clean());
});


//Start a web server on port 8282 to server the app webapp
gulp.task('connect-dev', function() {
    connect.server({
        root: 'app/',
        port: 8282,
        middleware: function (connect, opt) {
            return [
                modRewrite([
                    '^/api/(.*)$ http://localhost:3002/api/$1 [P]'
                ])
            ]
        }
    });
});

//Start a web server on port 8283 to server the build app (You probably wouldn't use this server for production delivery)
gulp.task('connect-prod', function() {
    connect.server({
        root: 'build/',
        port: 8283
    });
});

gulp.task('watch', ['usemin'], function () {
    gulp.watch('app/**/*.js', ['usemin'])
});

//Build task which should be used to build the application to production (By a continuous integration server for example)
gulp.task('build', ['create-templates', 'inject-templates', 'usemin', 'add-dependencies', 'copy-asset-files', 'clean', 'connect-prod']);

//Default task which simply servers the source files
gulp.task('default', ['connect-dev']);