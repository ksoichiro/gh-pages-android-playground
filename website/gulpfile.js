var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var git = require('gulp-git');
var harp = require('harp');
var del = require('del');
var gutil = require('gulp-util');

var paths = {
    bower: "./bower_components",
    harp: {
        project: ".",
        output: "./www"
    },
    dest: {
        root: "./www",
        lib: "./public/lib"
    },
    repo: "repo"
};
var port = 9000;

gulp.task('clean', function(cb) {
    del([paths.dest.root, paths.dest.lib, paths.repo], cb);
});

gulp.task('build', ['copy'], function() {
    harp.compile(paths.harp.project, paths.harp.output, function(err) {
        if (err) {
            gutil.log('build failed: ' + err);
        }
    });
});

gulp.task('copy', function() {
    // Return streams so that the dependent tasks can detect when it has done.
    return gulp.src(mainBowerFiles(), { base: paths.bower })
        .pipe(gulp.dest(paths.dest.lib));
});

gulp.task('deploy', function(cb) {
    // Remove old directory, if exists.
    del([paths.repo], cb);
    // Clone to build directory, commit files to gh-pages branch, and push it.
    git.clone('https://github.com/ksoichiro/gh-pages-android-playground.git', {args: paths.repo}, function(err) {});
    //git.checkout();
    //gulp.src(paths.harp.output)
    //    .pipe(gulp.dest(paths.repo);
    //git.add();
    //git.commit();
    //git.push();
});

gulp.task('start', ['build'], function() {
    harp.server(paths.harp.project, { port: port }, function(err) {
        if (err) {
            gutil.log('Failed to start');
            gutil.log(err);
        } else {
            gutil.log('Started server: http://localhost:' + port);
            gutil.log('Press Ctrl+C to quit');
        }
    });
});
