# flexible-rating
[![Build Status](https://travis-ci.org/mammooc/flexible-rating.svg?branch=master)](https://travis-ci.org/mammooc/flexible-rating)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/mammooc-rating.svg)](https://saucelabs.com/u/mammooc-rating)

`flexible-rating` is a Polymer element providing a clickable rating.

## Developing

Develop on the `dev` branch.

## Releasing

1. Create the documentation (on `dev` branch):
   ```
   npm run analyze
   ```

2. Switch to `master` and merge the `dev` branch

3. Build artefacts and release to npm

   ```
   npm version 3.1.2
   npm publish
   npm run bundle
   ```

4. Push everything incl. the new tag

5. Zip the content from the build directory and name it `flexible-rating-v3.1.2.zip`

6. Create a new GitHub release named `Version 3.1.2` for the tag pushed a few moments ago and shortly describe your changes.
