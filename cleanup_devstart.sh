#!/usr/bin/env bash

kill $(ps aux | grep 'python3 app.py' | awk '{print $2}') 2> /dev/null
kill $(ps aux | grep 'fswatch -i .* src' | awk '{print $2}') 2> /dev/null
kill $(ps aux | grep 'xargs -0 -n1 -I{} unbuffer mypy src' | awk '{print $2}') 2> /dev/null
  kill $(ps aux | grep 'unbuffer mypy **/*.py' | awk '{print $2}') &> /dev/null
kill $(ps aux | grep 'devstart' | awk '{print $2}') 2> /dev/null