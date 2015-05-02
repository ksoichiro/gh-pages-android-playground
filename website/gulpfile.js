var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var git = require('gulp-git');
var harp = require('harp');
var del = require('del');
var gutil = require('gulp-util');

var ghToken = process.env.GH_TOKEN;

// You should replace this configs to your project's values.
var project = {
    githubRepoOwner: 'ksoichiro',
    name: 'gh-pages-android-playground',
};

if (process.env.GH_TOKEN) {
    // Travis CI
    var gitBaseUrl = 'github.com/' + project.githubRepoOwner + '/' + project.name + '.git';
    project['gitUrl'] = 'https://' + gitBaseUrl;
    project['gitPushUrl'] = 'https://' + ghToken + '@' + gitBaseUrl;
} else {
    // Local
    var gitBaseUrl = 'github.com:' + project.githubRepoOwner + '/' + project.name + '.git';
    project['gitUrl'] = 'git@' + gitBaseUrl;
    project['gitPushUrl'] = project['gitUrl'];
}

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
    // This task is for production, so BASE_URL should be a project name.
    // $BASE_URL is referenced in harp.json, and it will be replaced by harp (envy).
    process.env.BASE_URL = '/' + project.name
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
    git.clone(project.gitUrl, {args: paths.repo}, function(err) {
        if (err) {
            gutil.log('Failed to clone: ' + err);
        } else {
            gutil.log('clone done');
        }
        cb();
    });
});

gulp.task('deploy', ['git-clone'], function(cb) {
    gutil.log('check out gh-pages...');
    git.checkout('origin/gh-pages', {args: '-b gh-pages', cwd: paths.repo}, function(err) {
        if (err) {
            gutil.log('Failed to check out branch: ' + err);
        } else {
            gutil.log('copying files...');
            gulp.src(paths.harp.output + '/**')
                .pipe(gulp.dest(paths.repo))
                .pipe(git.add({args: '-A', cwd: paths.repo}))
                .pipe(git.exec({args : 'diff-index --quiet HEAD --', cwd: paths.repo}, function (err, stdout) {
                    gutil.log('exec git diff-index: ' + err);
                    if (err) {
                        // There are some changes for gh-pages
                        gutil.log('There are some changes to commit.');
                        gulp.src(paths.harp.output + '/**')
                            .pipe(git.commit('Updated website.', {cwd: paths.repo}));
                        git.push(project.gitPushUrl, 'gh-pages', {args: '--quiet', cwd: paths.repo}, function(err) {
                            if (err) {
                                gutil.log('Failed to push: ' + err);
                            } else {
                                gutil.log('Pushed successfully.');
                            }
                            cb();
                        });
                    } else {
                        gutil.log('Nothing to commit.');
                        cb();
                    }
                }));
        }
    });
});

gulp.task('start', ['copy'], function() {
    // This task is for development locally, so BASE_URL should be empty.
    // $BASE_URL is referenced in harp.json, and it will be replaced by harp (envy).
    process.env.BASE_URL = ''
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
