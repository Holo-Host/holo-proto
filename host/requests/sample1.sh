curl --request POST \
  --url http://localhost:4001/fn/switchboard/dispatch \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/json' \
  --header 'postman-token: b246e65b-3e10-8e93-7731-dc3de88f9d8b' \
  --data '{"zome": "a", "func": "b", "args": "c"}'
