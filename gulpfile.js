/**
 * [Gulpfile for wxApp]
 * created by LJL
 */
const gulp = require('gulp');
const path = require('path');
const watch = require('gulp-watch');
const imagemin = require('gulp-imagemin');
const del = require('del');

// 源目录
const srcDir = {
    image: './src/**/*.{png,jpg,jpeg,svg}',
    js: './src/**/*.js',
    wxml: './src/**/*.wxml',
    wxss: './src/**/*.wxss',
    json: './src/**/*.json'
}
// 输出目录
const distDir = './dist';

gulp.task('image', ()=>{
    image();
});
gulp.task('image:watch', ()=>{
    watch(srcDir.image, {event: ['add','change','unlink']}, function(){
        image();
    });
})

gulp.task('json', function () {
	json();
});
gulp.task('json:watch', function () {
    watch([srcDir.json], {event: ['add','change','unlink']}, ()=>{
        json();
    });
});


gulp.task('clean',function() {
	del([
		'dist/**/*'
	]);
});

// 开发环境下编译
gulp.task('dev', ()=>{
    gulp.start('image','image:watch','json','json:watch')
});

// 正式环境下编译
gulp.task('build', ['clean'], ()=>{
    gulp.start('image','json')
});

// 编译image文件
function image(){
    gulp.src(srcDir.image)
        .pipe(imagemin())
        .pipe(gulp.dest(distDir))
        .on('end',()=>{
            console.log('image complite!')
        });
}

// 编译json
function json() {
	gulp.src(srcDir.json)
	    .pipe(gulp.dest(distDir))
        .on('end', ()=>{
            console.log('json complite!')
        });
}
