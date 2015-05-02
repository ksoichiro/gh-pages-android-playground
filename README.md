# gh-pages-android-playground

[![Build Status](https://travis-ci.org/ksoichiro/gh-pages-android-playground.svg?branch=master)](https://travis-ci.org/ksoichiro/gh-pages-android-playground)

Test project to publish documentation website using GitHub Pages via Travis CI with Android environment.

## TL;DR

* This projects provides some scripts to automate publishing project website on GitHub Pages.
* You can edit Markdown for documentation in `master` branch as usual.
* When you push it to GitHub, and after few minutes, the website will be updated!
* You don't have to care about syncing `master` and `gh-pages` branches.

## Why?

Usually we use `gh-pages` branch or Wiki to manage project documentation website on GitHub.

However, I wanted to manage them in master branch because:

* changing branch to edit documents is not so easy for those who are not familiar with git.  
  I'd like to get helps or pull requests from people who are interested in the project.
* documentations will be written in Markdown and they are not so big, so cloning them together is not bad. (It's rather useful to confirm documents locally.)

Also, I didn't want to manage them manually (building files, committing them to `gh-pages` branch, ...), so I automate the entire process.

I was going to introduce them to Android projects, but maybe this can be applied to other types of projects.

## Tools and services

This project uses these awesome tools and services to manage contents.

* [Travis CI](https://travis-ci.org)
* [npm](https://www.npmjs.com/)
* [gulp.js](http://gulpjs.com/)
* [harp](http://harpjs.com)
* [bower](http://bower.io/)

## Directory structure

```
projectRoot
├── app // Android app
├── docs // Documents to be published
├── gradle      // Gradle wrapper files
├── gradlew     // Gradle wrapper files
├── gradlew.bat // Gradle wrapper files
└── website // Scripts to publish website
    ├── .bowerrc // bower settings
    ├── bower.json // bower settings
    ├── bower_components // bower modules
    ├── gulpfile.js // gulp settings
    ├── harp.json // harp settings
    ├── node_modules // npm modules
    ├── package.json // npm settings
    ├── public // Files for website (.ejs, .jade, etc.)
    │   └── lib // Copied bower files to be published
    ├── repo // Another git repo to commit to gh-pages
    └── www // Files compiled by harp
```

## Setup

This project is just a showcase project for managing static contents in GitHub repo (especially using master branch), so you should configure some parts of the project to manage your own project.

#### Get API token from GitHub

Go to [Personal access tokens](https://github.com/settings/tokens) page,
click `Generate new token` and generate it.

Then encrypt it using travis command.

```sh
$ gem install travis
$ travis encrypt -r ksoichiro/gh-pages-android-playground GH_TOKEN="****************************************" --add
```

The result will be added to `.travis.yml`.

#### Create an empty branch gh-pages

At first, create `gh-pages` and push it to your repo.

```
git checkout --orphan gh-pages
```

`gh-pages` branch must be pushed to GitHub before building on Travis CI.

#### Enable Travis CI build

Go to account settings on Travis CI site, and enable builds for the project.

#### Install npm

`npm` is required to execute build commands.  
If you don't have `npm` in your environment, nvm (or nvm-windows) will be good.

#### Configure files

You must configure these files.

##### .travis.yml

```yaml
env:
  global:
  - GIT_COMMITTER_NAME=ksoichiro
  - GIT_COMMITTER_EMAIL=soichiro.kashima@gmail.com
  - GIT_AUTHOR_NAME=ksoichiro
  - GIT_AUTHOR_EMAIL=soichiro.kashima@gmail.com
  - secure: Tszvcrpj37Y2/iLG2ke42Zl/lOzwi21IfRafmnyoAqSWycwuEwFzp4wjHNUZEEVVdiAU5my2CfVhcPakF3bdcFt9Dg1lUP8SSuMgrUurGD95wfJ2ORNU1B+3GElKItO8yKjG1eruDNzgOCwX1VocSnCXZbHeg3p1mhE5UEIht+w=
```

`env.global.secure` is the result of `travis encrypt`.

##### website/gulpfile.js

```javascript
var project = {
    githubRepoOwner: 'ksoichiro',
    name: 'gh-pages-android-playground',
};
```

These values define the Git repository URLs.

##### website/package.json

```json
{
  "name": "gh-pages-android-test",
  "description": "Web site for Android projects on GitHub",
  "repository": {
    "type": "git",
    "url": "https://github.com/ksoichiro/gh-pages-android-playground.git"
  },
```

##### website/bower.json

```json
{
  "name": "gh-pages-android-test",
  "description": "bower components for gh-pages-android-test",
```

Just replace text to match your project.

##### website/harp.json

```json
{
  "globals": {
    "baseUrl": "$BASE_URL",
    "title": "gh-pages-android-playground"
  }
}
```

Just replace `globals.title` to match your project.  
`globals.baseUrl` is used to construct proper URLs in HTML for local or production.

## Build and deploy

### Install npm dependencies

Every operations to manage website in local environment are executed in `website` directory.
At first, you should move to the directory and install the dependencies.

```sh
cd website
npm install
```

### Start a server

Then start a web server.

```sh
npm start
```

`http://localhost:9000/` will be used.

### Edit files

After launching a server, you can edit files such as  
`<projectRoot>/docs/*.md`,  
`<projectRoot>/website/public/*.ejs`, and so on.  
You can confirm the result by reloading the browser.

If they're OK, commit the edited files.

### Deploy

You can deploy the contents manually or Travis CI builds.

#### Deploy manually

Run the following command in `website` directory.

```
npm run clean && npm run deploy
```

This command will build static files and automatically commit and push the changes to the `gh-pages` branch of GitHub repository.

#### Deploy using Travis CI

Just push the master branch to GitHub.  
Static contents are built on Travis CI, and the changes will be committed and pushed to the `gh-pages` branch of GitHub repository.

## License

    Copyright 2015 Soichiro Kashima

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
