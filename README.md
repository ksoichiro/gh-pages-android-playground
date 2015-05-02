# gh-pages-android-playground

[![Build Status](https://travis-ci.org/ksoichiro/gh-pages-android-playground.svg?branch=master)](https://travis-ci.org/ksoichiro/gh-pages-android-playground)

Test project to publish documentation website via Travis CI with Android  environment.

## Setup

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

#### Configure files

You should configure these files at least.

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

##### website/gulpfile.js

```javascript
var project = {
    githubRepoOwner: 'ksoichiro',
    name: 'gh-pages-android-playground',
};
```

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

##### website/harp.json

```json
{
  "globals": {
    "baseUrl": "$BASE_URL",
    "title": "gh-pages-android-playground"
  }
}
```

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
