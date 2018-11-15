#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

cd $DIR
node generate.js
git add *
git commit -m "Update website"
git push origin master
