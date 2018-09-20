source bin/functions.sh

SUFF=$1
switchboard=hh-switchboard-$SUFF
accountant=hh-accountant-$SUFF
happ=hh-happ-$SUFF

joinapp hosted-happs/sample-app-1 $happ 4006
joinapp hosting-happs/build/accountant $accountant 4004
joinapp hosting-happs/build/switchboard $switchboard 4002

APP_HASH=`cat ~/.holochain/$happ/dna.hash`
echo "got happ hash: $APP_HASH"

hcadmin --verbose bridge $accountant $happ accountant
hcadmin --verbose bridge $switchboard $accountant management --bridgeCallerAppData $APP_HASH

hcd --debug $switchboard 4001 &
hcd --debug $accountant 4003 &
hcd --debug $happ 4005 &
