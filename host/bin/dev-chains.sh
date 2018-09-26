# source bin/functions.sh

# SUFF=$1
# accountant=$1
accountant=accountant

ACCOUNTANT_PORT=4003

TMP=$(mktemp -t holo-prototype)
mv $TMP ${TMP}.json
TMP=${TMP}.json
DNA_HASH='QmbZeFchQ3gtc1ZUUpZSSsznZDjyeq1dJMBq12hCohpygH'
# DNA_HASH='TODO'
jq '.[0].BridgeGenesisCallerData = "$DNA_HASH"' $accountant/bridge_specs.json > $TMP
# cat $accountant/bridge_specs.json > $TMP
echo $TMP
# echo "before..."
# echo `cat $accountant/bridge_specs.json`
# echo "after..."
echo `cat $TMP`
cd $accountant
hcdev -bridgeSpecs $TMP web $ACCOUNTANT_PORT
