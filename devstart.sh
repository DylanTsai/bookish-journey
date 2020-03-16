#!/usr/bin/env bash

: <<'long_comment'
Requirements:
- Bash 4+
- OSX
- fswatch (available on brew)
- unbuffer (available on brew via `brew install expect`)
- gnu-sed (available on brew)

Lots of commands are spawned in the background and aren't properly cleaned up on 
exit, so please quit by pressing 'q'. If you do quit through some other way,
(e.g. using ctrl+C), it might be a good idea to run cleanup_devstart.sh.
All that does right now is run kill $(ps aux | grep 'devstart' | awk '{print $2}').
long_comment


export TCLLIBPATH=/usr/local/lib
source symba_env/bin/activate
mkdir -p .devstartlogs/

flask_pid=""
babel_pid=""

repoSrcDir="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
#$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )

mypy_buf=$repoSrcDir/.devstartlogs/mypy_buf
flask_buf=$repoSrcDir/.devstartlogs/flask_buf
babel_buf=$repoSrcDir/.devstartlogs/babel_buf
mypy_output=$repoSrcDir/.devstartlogs/mypy.log
flask_output=$repoSrcDir/.devstartlogs/flask.log
babel_output=$repoSrcDir/.devstartlogs/babel.log
fswatch_log=$repoSrcDir/.devstartlogs/fswatch.log

function print_help() {
  echo -e "\n\n"
  echo "<Enter> to restart Flask"
  echo "'b' to print recent BABEL output (terse)"
  echo "'B' to examine BABEL output history (terse) in less"
  echo "'f' to print recent FLASK output"
  echo "'F' to examine FLASK output history in less"
  echo "'m' to print recent MYPY output"
  echo "'M' to examine MYPY output history in less"
  echo "'i' for help"
  echo "'q' to quit"
}

function carriage_to_newline() {
  perl -pi -e 's/\r/\n/g' $1
}


# function clear_format() {
#   gsed_str="s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g"
#   gsed -r $gsed_str $1 | tr $'\r' $'\n' >clear_formatting_temp && mv clear_formatting_temp $1
#   # gsed -ri "s/[[:cntrl:]]\[[0-9]{1,3}m//g" $1
# }

chmod 777 $fswatch_log
chmod 777 $repoSrcDir/src/app.py

function mypy_watch() {
  while true
  do
    fswatch -i *.py -0 -o --event PlatformSpecific src | xargs -0 -n1 -I{} unbuffer mypy src 2>&1 | tee -a $mypy_buf $mypy_output > /dev/null
  done
}

function restart_flask() {
  cd $repoSrcDir/src
  kill $(ps aux | grep 'python3 app.py' | awk '{print $2}') &> /dev/null
  python3 app.py |& tee -a $flask_buf $flask_output &> /dev/null &
  flask_pid="$!"
  cd $repoSrcDir
}

function start_babel() {
  cd $repoSrcDir/src/static/
  unbuffer npm run watch 2>>$babel_output | tee -a $babel_buf $babel_output > /dev/null &
  babel_pid="$!"
  cd $repoSrcDir
}

function echo_header {
  color=""
  endcolor=""
  if [ $# -gt 1 ]
  then
    color=$2
    endcolor='\033[0m'
  fi
  middle_len=$(( ${#1} + 2 ))
  num_dashes=$(( (${COLUMNS:-$(tput cols)} - $middle_len) / 3 ))
  lots_of_dashes=-------------------------------------------------------------------------------------------------------------
  echo -e "\n\n"$color${lots_of_dashes:0:$num_dashes} $1 ${lots_of_dashes:0:$num_dashes}$endcolor
}

function run() {
  > $flask_output
  > $babel_output
  > $mypy_output
  > $flask_buf
  > $babel_buf
  > $mypy_buf
  > $fswatch_log

  mypy_watch &
  mypy_pid="$!"
  start_babel
  restart_flask

  print_help

  local need_new_prompt=true 
  while true
  do
    user_input=""
    if [ $need_new_prompt = true ]
    then 
      echo -e "\n\n"
      IFS= read -p "cmd: " -r -t 1 -N 1 user_input
      need_new_prompt=false
    else
      IFS= read -r -t 1 -N 1 user_input
    fi
    if [[ `cat $babel_buf` = *[![:space:]]* ]]
    then
      echo_header 'babel' '\033[0;35m'
      while true
      do
        timeout 2 fswatch -1 $babel_buf || break &> /dev/null
      done
      sed -n '/Object.raise/q;p' $babel_buf
      > $babel_buf
      need_new_prompt=true
    fi
    if [[ `cat $mypy_buf` = *[![:space:]]* ]]
    then
      echo_header 'mypy' '\033[0;35m'
      while true
      do
        timeout 2 fswatch -1 $mypy_buf || break &> /dev/null
      done
      cat $mypy_buf
      > $mypy_buf
      need_new_prompt=true
    fi
    if [[ `cat $flask_buf` = *[![:space:]]* ]]
    then
      echo_header 'flask' '\033[0;35m'
      while true
      do
        timeout 2 fswatch -1 $flask_buf || break &> /dev/null
      done
      cat $flask_buf
      > $flask_buf
      need_new_prompt=true
    fi
    
    if  [ "${user_input-}" = $'\n' ]
    then
      echo -e "\n\n Restarting flask..."
      restart_flask
      need_new_prompt=true
    else
      case $user_input in
      "") ;;
      b) echo -e "\n\n"
        tail -n 50 $babel_output
        need_new_prompt=true
        ;;
      B) echo -e "\n\n"
        carriage_to_newline $babel_output
        less -R $babel_output
        need_new_prompt=true
        ;;
      f) echo -e "\n\n"
        tail -n 50 $flask_output
        need_new_prompt=true
        ;;
      F) echo -e "\n\n"
        less -R $flask_output
        need_new_prompt=true
        ;;
      m) echo -e "\n\n"
        tail -n 50 $mypy_output
        need_new_prompt=true
        ;;
      M) echo -e "\n\n"
        less -R $mypy_output
        need_new_prompt=true
        ;;
      h) print_help
        need_new_prompt=true
        ;;
      q)
        break
        ;;
      *) echo -e "\n\nNot a valid command. Type 'h' for help" 
        need_new_prompt=true
        ;;
      esac
    fi
  done

  if [ ! "$flask_pid" = "" ]
  then
    kill $flask_pid &> /dev/null
  fi
  if [ ! "$babel_pid" = "" ]
  then
    kill $babel_pid &> /dev/null
  fi
  if [ ! "$mypy_pid" = "" ]
  then
    kill $mypy_pid &> /dev/null
  fi
  carriage_to_newline $babel_output
  rm $flask_buf
  rm $babel_buf
  rm $mypy_buf
  kill $(ps aux | grep 'python3 app.py') &> /dev/null
  kill $(ps aux | grep 'unbuffer npm run watch') &> /dev/null
  kill $(ps aux | grep 'xargs -0 -n1 -I{} unbuffer mypy src' | awk '{print $2}') &> /dev/null
  kill $(ps aux | grep 'unbuffer mypy **/*.py' | awk '{print $2}') &> /dev/null
  kill $(ps aux | grep 'fswatch -i .* src' | awk '{print $2}') &> /dev/null
  cd $repoSrcDir
  deactivate
  kill $(ps aux | grep 'devstart' | awk '{print $2}') &> /dev/null
}

run
