#!/bin/bash

echo "TEST_TARGET=${TEST_TARGET}"
echo "TRAVIS_PULL_REQUEST=${TRAVIS_PULL_REQUEST}"
echo "TRAVIS_BRANCH=${TRAVIS_BRANCH}"

if [ "$TEST_TARGET" = "android" ]; then
  ./gradlew --full-stacktrace assemble
elif [ "$TEST_TARGET" = "website" ]; then
  if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_BRANCH" = "master" ] && [ ! -z "$GH_TOKEN" ]; then
    echo "Update website..."
    pushd website > /dev/null 2>&1
    npm run deploy
    popd > /dev/null 2>&1
  fi
fi
