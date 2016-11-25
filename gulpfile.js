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
// const base64 = require('postcss-base64');
const rename = require('gulp-rename')
const jshint = require('gulp-jshint');
const less = require('gulp-less');
const plumber = require('gulp-plumber');
const ifElse = require('gulp-if-else');
var isBuild = false;

// 源目录
const srcDir = {
    js: './src/**/*.js',
    views: './src/**/*.{html,wxml}',
    wxss: './src/**/*.wxss',
    json: './src/**/*.json',
    image: [
        `./src/**/*.{png,jpg,jpeg,svg}`,
        `!src/**/_*/*.{png,jpg,jpeg,svg}`,
        `!src/**/_*.{png,jpg,jpeg,svg}`
    ],
    css: [
        `./src/**/*.{less,sass,scss}`,
        `!/src/**/_*/*.{less,sass,scss}`,
        `!src/**/_*.{less,sass,scss}`
    ]
}

// 输出目录
const distDir = './dist';

var processes = [
    // autoprefixer({ browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4'] }),
    atImport,
    precss,
    cssnano,  // 压缩
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
        js(file)
    })
})

gulp.task('wxss', ()=>{
    compileWxss(srcDir.wxss, distDir); // 编译 .wxss
});
gulp.task('wxss:watch', ()=>{
    watch([srcDir.wxss], {event: ['add','change','unlink']}, (file)=>{
        compileWxss(srcDir.wxss, distDir, file); // 编译 .wxss
    })
})

gulp.task('css', ()=>{
    compileLess(srcDir.css, distDir);
})
gulp.task('css:watch', ()=>{
    watch([srcDir.css], {event: ['add','change','unlink']}, (file)=>{
        compileLess(srcDir.css, distDir, file);
    })
})

gulp.task('views', ()=>{
    views();
})
gulp.task('views:watch', ()=>{
    watch([srcDir.views], {event: ['add','change','unlink']}, (file)=>{
        views(file);
    })
})

gulp.task('clean', ()=>{
    del([
        'dist/**/*'
    ]);
});

// 开发环境下编译
gulp.task('dev', ()=>{
    gulp.start('image', 'image:watch', 'json', 'json:watch', 'js', 'js:watch', 'wxss', 'wxss:watch', 'css', 'css:watch', 'views', 'views:watch');
});

// 正式环境下编译
gulp.task('build', ['clean'], ()=>{
    isBuild = true;
    gulp.start('image', 'json', 'js', 'wxss', 'css', 'views');
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

// 编译js
function js(file){
    gulp.src(srcDir.js)
        .pipe(jshint())
        // .pipe(jshint.reporter())
        .pipe(gulp.dest(distDir))
        .on('end', ()=>{
            if(file){
                console.log(file.path + ' complite!')
            }else{
                console.log('js complite!')
            }
        });
}

// 编译html、wxml文件成wxml
function views(file){
    gulp.src(srcDir.views)
        .pipe(rename({extname: '.wxml'}))
        .pipe(gulp.dest(distDir))
        .on('end', ()=>{
            if(file){
                console.log(file.path + ' complite!');
            }else{
                console.log('wxml complite! ');
            }
        });
}
/**
 * [compileWxss 编译WXSS文件]
 * @param  {[string]} src  [源目录]
 * @param  {[string]} dist [输出目录]
 * @param  {[string]} file [当前文件名，非必填]
 */
function compileWxss(src, dist, file) {
	return gulp.src(src)
	.pipe(base64({
		extensions: ['png', /\.jpg#datauri$/i],
		maxImageSize: 10 * 1024 // bytes,
	}))
	.pipe(postcss(processes))
	.pipe(gulp.dest(dist))
    .on('end', ()=>{
        if(file){
            console.log(file.path + ' complite!')
        }else{
            console.log('wxss complite!')
        }
    })
}

/**
 * [compileWxss 编译less文件]
 */
function compileLess(src, dist, file){
    return gulp.src(src)
    .pipe(plumber())
    .pipe(less())
    .pipe(base64({
		extensions: ['png', /\.jpg#datauri$/i],
		maxImageSize: 10 * 1024 // bytes,
	}))
    .pipe(ifElse(isBuild === true, function () {
		return postcss(processes);
	}))
    .pipe(rename({extname: '.wxss'}))
    .pipe(gulp.dest(dist))
    .on('end', ()=>{
        if(file){
            console.log(file.path, + ' to wxss complite!');
        }else{
            console.log('less to wxss complite!');
        }
    })
}
