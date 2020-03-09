#!/usr/bin/env bash

kill $(ps aux | grep 'python3 app.py' | awk '{print $2}') 2> /dev/null
kill $(ps aux | grep 'fswatch -i .* src' | awk '{print $2}') 2> /dev/null
kill $(ps aux | grep 'xargs -0 -n1 -I{} unbuffer mypy src –ignore-missing-imports' | awk '{print $2}') 2> /dev/null
kill $(ps aux | grep 'unbuffer npm run watch') &> /dev/null
kill $(ps aux | grep 'devstart' | awk '{print $2}') 2> /dev/null