#!/bin/bash -e
npm version $1
git push
git push --tags
./utils/github-pages.sh mammooc flexible-rating
rm -rf ./flexible-rating
