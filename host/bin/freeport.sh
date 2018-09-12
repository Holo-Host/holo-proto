
function freeport {
  # Find a port such that it and the next N consecutive ports are all free
  # usage: freeport BASE_PORT N
  BASE_PORT=$1
  N=$2

  baseport=$BASE_PORT
  port=$BASE_PORT
  isfree=$(netstat -taln | grep $port)
  ok=0
  while (($ok == 0)); do
    for ((i=1; i<=N; i++)); do
      isfree="$(netstat -taln | grep $port)"
      if [[ -n "$isfree" ]]
      then
        ok=0
        break
      else
        ok=1
      fi
      port=$[baseport+i]
    done
    if (( $ok == 1 )); then
      break
    fi
    baseport=$[baseport+1]
    port=$baseport
  done
  echo $baseport
}