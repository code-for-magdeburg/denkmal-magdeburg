#!/bin/bash
FRONTEND_REMOTE_LOCATION=jfilter@vis.one:/var/www/virtual/jfilter/vis.one/denkmal-magdeburg

yarn build &&
rsync --recursive --verbose --delete build/ $FRONTEND_REMOTE_LOCATION
