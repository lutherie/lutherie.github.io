#!/usr/bin/env bash

node generate.js
git add *
git commit -m "Update website"
git push origin master
