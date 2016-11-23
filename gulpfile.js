/**
 * [Gulpfile for wxApp]
 * created by LJL
 */
const gulp = require('gulp');
const path = require('path');
const watch = require('gulp-watch');
const imagemin = require('gulp-imagemin');
const del = require('del');
const postcss = require('gulp-postcss');
const precss = require('precss');
const cssnano = require('cssnano');
const atImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const base64 = require('gulp-base64');

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

var processes = [
    // autoprefixer({ browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4'] }),
    atImport,
    precss,
    // cssnano,  // 压缩
];

gulp.task('image', ()=>{
    image();
});
gulp.task('image:watch', ()=>{
    watch(srcDir.image, {event: ['add','change','unlink']}, function(){
        image();
    });
})

gulp.task('json', ()=>{
	json();
});
gulp.task('json:watch', ()=>{
    watch([srcDir.json], {event: ['add','change','unlink']}, ()=>{
        json();
    });
});

gulp.task('js', ()=>{
    js();
})
gulp.task('js:watch', ()=>{
    watch([srcDir.js], {event: ['add','change','unlink']}, (file)=>{
        gulp.src(srcDir.js)
            .pipe(gulp.dest(distDir))
            .on('end', ()=>{
                console.log(file.path + ' complite!')
            });
    })
})

gulp.task('wxss', ()=>{
    compileWxss(srcDir.wxss, distDir); // 编译 .wxss
});

gulp.task('clean', ()=>{
    del([
        'dist/**/*'
    ]);
});

// 开发环境下编译
gulp.task('dev', ()=>{
    gulp.start('image','image:watch','json','json:watch','js','js:watch', 'wxss')
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
            // console.log('json complite!')
        });
}

// 编译js
function js(){
    gulp.src(srcDir.js)
        .pipe(gulp.dest(distDir))
        .on('end', ()=>{
            console.log('js complite!')
        });
}

function compileWxss(src, dist) {
	return gulp.src(src)
	// .pipe(base64({
	// 	extensions: ['png', /\.jpg#datauri$/i],
	// 	maxImageSize: 10 * 1024 // bytes,
	// }))
	.pipe(postcss(processes))
	.pipe(gulp.dest(dist))
}
