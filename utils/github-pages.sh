#!/bin/bash -e
#
# @license
# Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
# This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
# The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
# The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
# Code distributed by Google as part of the polymer project is also
# subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
#

# This script pushes a demo-friendly version of your element and its
# dependencies to gh-pages.

# usage gp Polymer core-item [branch]
# Run in a clean directory passing in a GitHub org and repo name
org=$1
repo=$2
branch=${3:-"master"} # default to master when branch isn't specified

# make folder (same as input, no checking!)
mkdir $repo
git clone git@github.com:$org/$repo.git

# switch to gh-pages branch
pushd $repo >/dev/null
git checkout --orphan gh-pages

# remove all content
git rm -rf -q .

# use npm to install runtime deployment
git show origin/${branch}:package.json > package.json
npm install --ignore-scripts
npm install $org/$repo#$branch --force --ignore-scripts
find node_modules -name "*.md" -type f -delete # Prevents build bug on GH pages
find node_modules -name "*.exe" -type f -delete # Prevents binary warning on GH pages

find . -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/'@polymer\//'\/flexible-rating\/node_modules\/@polymer\//g"
find . -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/'@webcomponents\//'\/flexible-rating\/node_modules\/@webcomponents\//g"
find . -type f -name "*.html" -print0 | xargs -0 sed -i '' -e "s/'@polymer\//'\/flexible-rating\/node_modules\/@polymer\//g"
find . -type f -name "*.html" -print0 | xargs -0 sed -i '' -e "s/'@webcomponents\//'\/flexible-rating\/node_modules\/@webcomponents\//g"
find . -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/import 'marked\//import '\/flexible-rating\/node_modules\/marked\//g"
find . -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/import 'prismjs\//import '\/flexible-rating\/node_modules\/prismjs\//g"

git checkout origin/${branch} -- demo
rm -rf node_modules/$repo/demo
mv demo node_modules/$repo/

# redirect by default to the component folder
echo "<META http-equiv="refresh" content=\"0;URL=node_modules/$repo/\">" >index.html

# send it all to github
git add -A .
git commit -am 'seed gh-pages'
git push -u origin gh-pages --force

popd >/dev/null
