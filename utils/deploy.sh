#!/bin/bash -e
npm --no-git-tag-version version $1
git add package.json package-lock.json
git commit -m $1
git push
./utils/github-pages.sh mammooc flexible-rating
rm -rf ./flexible-rating
