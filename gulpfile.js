let gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin')

gulp.task('sass', function(){      // Здесь 'sass' - это имя задания. Вызваем это задание втерминале как (gulp sass)
    return gulp.src('app/scss/**/*.scss')     // Ищем файл с которым нужно что то сделать
            .pipe(sass({outputStyle: 'compressed'}))    // преобразовывается в css (sass() - это тот который мы указали через let (который gulp-sass))
                                                        // можно и другие "станции" подрубать по пути
            .pipe(rename({suffix: '.min'}))             // переименовываем файл (добавляем суффикс '.min')

            .pipe(autoprefixer({
                overrideBrowserslist: ['last 8 versions']  // Добавляет вендерные префиксы, для того чтобы старые версии браузера поддерживали свойства прописанные в css
            }))
            .pipe(gulp.dest('app/css'))                 // сохраняется в 'app/css'
            .pipe(browserSync.reload({stream: true}));  // Обновление страницы
});

gulp.task('style', function(){
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/magnific-popup/dist/magnific-popup.css'
    ])

    .pipe(concat('libs.min.css'))   // Файлы выше будут в объеденены в один (libs.min.js)
    .pipe(cssmin())
    .pipe(gulp.dest('app/css'))
});


gulp.task('script', function(){
    return gulp.src([
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/mixitup/dist/mixitup.js'
    ])

    .pipe(concat('libs.min.js'))   // Файлы выше будут в объеденены в один (libs.min.js)
    .pipe(uglify())               // Минифицируем
    .pipe(gulp.dest('app/js'))
});



gulp.task('html', function(){
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function(){
    return gulp.src('app/js/*.js')
    .pipe(browserSync.reload({stream: true}));
});



gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});


gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));   // Метод watch() следит за файлом и
                                                                  // если изменится файл (style.min.css), то запустится таск 'sass'
    gulp.watch('app/*.html', gulp.parallel('html')); 
    gulp.watch('app/js/*.js', gulp.parallel('js')); 
});

gulp.task('default', gulp.parallel('style', 'script', 'sass', 'watch', 'browserSync'));   // По дефолту (когда в терминале пропишем просто 'gulp')
                                                                       // начнут выполняться  'sass', 'watch', 'browserSync'