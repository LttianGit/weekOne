var gulp = require('gulp');
var options = {
    collapseWhitespace: true
};
var fs = require('fs');
var path = require('path');
var url = require('url');
var sass = require('gulp-sass');
var server = require('gulp-webserver');
var data = require('./mock/data/data.json');

gulp.task('devCss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
})

gulp.task('watch', function() {
    return gulp.src('./src/scss/*.scss', gulp.series('devCss'));
})

gulp.task('devServer', function() {
    return gulp.src('./src')
        .pipe(server({
            port: 9090,
            host: '169.254.65.232',
            middleware: function(req, res, next) {
                if (req.url == '/favicon.ico') {
                    return;
                }
                var pathname = url.parse(req.url).pathname;
                var ext = path.extname(pathname);
                if (pathname === '/') {
                    res.end(fs.readFileSync('./src/index.html'));
                } else {
                    if (ext) {
                        console.log(pathname)
                        var pn = path.join(__dirname, 'src', pathname);
                        res.end(fs.readFileSync(pn));
                    } else {
                        res.end(JSON.stringify({ data: data }));
                    }
                }
            }
        }))
})

gulp.task('dev', gulp.series('devCss', 'watch', 'devServer'));