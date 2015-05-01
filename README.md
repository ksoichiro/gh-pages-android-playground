# gh-pages-android-playground

Test project to publish documentation website via Travis CI with Android  environment.

### Setup

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


