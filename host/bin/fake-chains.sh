# source bin/functions.sh

# SUFF=$1
accountant=hosting-happs/build/accountant
# accountant=accountant

TMP=$(mktemp -t holo-prototype)
mv $TMP ${TMP}.json
TMP=${TMP}.json
APP_HASH='QmbZeFchQ3gtc1ZUUpZSSsznZDjyeq1dJMBq12hCohpygH'
# APP_HASH='TODO'
jq '.[0].BridgeGenesisCallerData = "$APP_HASH"' $accountant/bridge_specs.json > $TMP
cat $accountant/bridge_specs.json > $TMP
echo $TMP
# echo "before..."
# echo `cat $accountant/bridge_specs.json`
# echo "after..."
echo `cat $TMP`
cd $accountant
hcdev -bridgeSpecs $TMP web 4003
