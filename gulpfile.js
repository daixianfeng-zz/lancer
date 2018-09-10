var gulp = require('gulp');
var webserver = require('gulp-webserver');
var rename = require("gulp-rename");
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
let cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');


gulp.task('webserver', function(){
    gulp.src('./').pipe(webserver({
            port: 8801,//端口
            host: '127.0.0.1',//域名
            liveload: false,//实时刷新代码。不用f5刷新
            directoryListing: {
                path: './',
                enable: true
            }
        }));
});

var version = '1.2.0';
gulp.task('clean', function(){
    return gulp.src('./dist/'+version)
        .pipe(clean({force: true}));
});

gulp.task('css', function(){
    return gulp.src('./src/**/*.css')
        .pipe(gulp.dest('./dist/'+version+'/'))
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/'+version+'/'))
});
gulp.task('less', function(){
    return gulp.src('./src/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./dist/'+version+'/'))
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/'+version+'/'))
});
gulp.task('js', function(){
    return gulp.src('./src/**/*.js')
        .pipe(gulp.dest('./dist/'+version+'/'))
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'+version+'/'))
});

gulp.task('default', ['less','css','js']);