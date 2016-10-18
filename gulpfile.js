var gulp = require('gulp');
var webserver = require('gulp-webserver'); 
var less = require('gulp-less');
var path = require('path');
var clean = require('gulp-clean');

gulp.task('webserver', function(){
    gulp.src('./').pipe(webserver({
            port: 8888,//端口
            host: '127.0.0.1',//域名
            liveload: false,//实时刷新代码。不用f5刷新
            directoryListing: {
                path: './',
                enable: true
            }
        }));
});

var version = '0.0.1';
gulp.task('clean', function(){
    return gulp.src('./dist/'+version)
        .pipe(clean({force: true}));
});
gulp.task('less', function(){
    return gulp.src('./src/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./dist/'+version+'/'))
});
gulp.task('css', function(){
    return gulp.src('./src/**/*.css')
        .pipe(gulp.dest('./dist/'+version+'/'))
});
gulp.task('js', function(){
    return gulp.src('./src/**/*.js')
        .pipe(gulp.dest('./dist/'+version+'/'))
});

gulp.task('default', ['less','css','js']);
