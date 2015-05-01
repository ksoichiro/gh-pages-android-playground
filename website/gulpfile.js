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

gulp.task('build', ['copy'], function(cb) {
    harp.compile(paths.harp.project, paths.harp.output, function(err) {
        if (err) {
            gutil.log('build failed: ' + err);
        }
        gutil.log('Compile done');
        cb();
    });
});

gulp.task('copy', function() {
    // Return streams so that the dependent tasks can detect when it has done.
    return gulp.src(mainBowerFiles(), { base: paths.bower })
        .pipe(gulp.dest(paths.dest.lib));
});

gulp.task('remove-repo', ['build'], function(cb) {
    // Remove old directory, if exists.
    gutil.log('removing repo..');
    del([paths.repo], cb);
});

gulp.task('git-clone', ['remove-repo'], function(cb) {
    // Clone to build directory, commit files to gh-pages branch, and push it.
    git.clone('https://github.com/ksoichiro/gh-pages-android-playground.git', {args: paths.repo}, function(err) {
        gutil.log('clone done');
        cb();
    });
});

gulp.task('deploy', ['git-clone'], function(cb) {
    gutil.log('check out gh-pages...');
    git.checkout('gh-pages', {args: '-b', cwd: paths.repo}, function(err) {
        gutil.log('copying files...');
        gulp.src(paths.harp.output + '/**')
            .pipe(gulp.dest(paths.repo))
            .pipe(git.add({args: '-A', cwd: paths.repo}));
        //git.commit();
        //git.push();
        gutil.log('done');
        cb();
    });
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
