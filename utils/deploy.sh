#!/bin/bash -e
npm --no-git-tag-version version $1
git push
git push --tags
./utils/github-pages.sh mammooc flexible-rating
rm -rf ./flexible-rating
