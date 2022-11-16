#!/bin/bash

# exit immediately if any command fails
set -e

# set indent function
indent() { sed '/^\s*$/d; s/^/   /'; }

echo "Running type check..."
TSC="./node_modules/typescript/bin/tsc --noEmit --project tsconfig.json --pretty"

eval $(echo $TSC) | indent
if [ "$PIPESTATUS" = "0" ]; then
    PASS=true
else
    PASS=false
fi

# exit if type checks fail
if [ "$PASS" = "false" ]; then
    echo
    echo "Typechecking failed 👎" | indent
    echo
    exit 1
else
    echo
    echo "Typechecking passed 👍" | indent
    echo
fi