#!/bin/bash

echo "TEST_TARGET=${TEST_TARGET}"
echo "TRAVIS_PULL_REQUEST=${TRAVIS_PULL_REQUEST}"
echo "TRAVIS_BRANCH=${TRAVIS_BRANCH}"
echo "GH_TOKEN=${GH_TOKEN}"

if [ "$TEST_TARGET" = "android" ]; then
  # This should be replaced to "./gradlew assmble" or something like that
  echo "Building..."
elif [ "$TEST_TARGET" = "website" ]; then
  if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_BRANCH" = "master" ] && [ ! -z "$GH_TOKEN" ]; then
    echo "Update website..."
    pushd website > /dev/null 2>&1
    npm run deploy
    popd > /dev/null 2>&1
  fi
fi
