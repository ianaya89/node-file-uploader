var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var defaultTasks = ['jshint', 'csslint', 'develop', 'watch'];
var paths = {
   js: ['./*.js', 'public/**/*.js', '!gulpfile.js'],
   html: ['./public/**/*.html', './public/*.html'],
   css: ['./public/**/*.css']
};

gulp.task('watch', function() {
    plugins.livereload.listen({
        interval: 500
    });
    gulp.watch(paths.js, ['jshint'])
    gulp.watch(paths.css, ['csslint']).on('change', plugins.livereload.changed);
});

gulp.task('develop', function() {
    plugins.nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore: ['node_modules/'],
        tasks: [],
        nodeArgs: ['--debug']
    })
    .on('restart', function() {
        console.log('restarted!')
    })
});

gulp.task('csslint', function() {
    return gulp.src(paths.css)
    .pipe(plugins.csslint())
    .pipe(plugins.csslint.reporter());
});

gulp.task('jshint', function() {
    return gulp.src(paths.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
    });

gulp.task('plato', function() {
    return gulp.src(paths.js)
    .pipe(plugins.plato('report', {
        jshint: {
            options: {
                strict: true
            }
        },
        complexity: {
            trycatch: true
        }
    }));
});

gulp.task('default', defaultTasks);