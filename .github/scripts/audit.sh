#!/usr/bin/env bash

# Exit with nonzero exit code if anything fails
set -e 

red="\033[0;31m"
boldred="\033[1;31m"
white="\033[0;37m"
boldwhite="\033[1;37m"
green="\033[0;32m"
yellow="\033[0;33m"
nocolor="\033[0m"


_install () {
    # Install pnpm dependencies
    printf "$boldwhite" ; echo -en "\n1. Installing dependencies...\n"
    pnpm fetch
    pnpm install -r
    pnpm i better-sqlite3 # this is a dependency, but sometimes it doesn't install properly
}

_audit () {
    # Audit pnpm dependencies
    printf "$boldwhite" ; echo -en "\n2. Auditing installed dependencies...\n"
    mkdir -p test
    pnpm audit --json > test/audit.json

    # Look for vulnerabilities by grepping "critical", "high", "moderate", "low" that are not equal to 0
    if grep -i "critical" < ./test/audit.json | grep -v "0" > /dev/null; then
        printf "$red" ; echo -en "Critical vulnerabilities found in audit.json\n"
        return 1
    elif grep -i "high" < test/audit.json | grep -v "0" > /dev/null; then
        printf "$red" ; echo -en "High vulnerabilities found in audit.json\n"
        return 1
    elif grep -i "moderate" < ./test/audit.json| grep -v "0" > /dev/null; then
        printf "$red" ; echo -en "Moderate vulnerabilities found in audit.json\n"
        return 1
    elif grep -i "low" < ./test/audit.json | grep -v "0" > /dev/null; then
        printf "$red" ; echo -en "Low vulnerabilities found in audit.json\n"
        return 1
    else
        printf "$green" ; echo -en "No vulnerabilities found in audit.json\n"
        return 0
    fi
}

_test () {
    # Run tests
    printf "$boldwhite" ; echo -en "\n3. Running tests...\n"
    timeout 3m pnpm run start > errors.log ;
    
    # Parse errors.log to check if any errors were thrown
    mkdir -p test
    if grep -i "error" ./test/errors.log > /dev/null; then
        printf "$boldred" ; echo -en "Error(s) found in errors.log:\n"
        # Return lines with error
        printf "$red" ; grep -i "error" < errors.log ; echo -en "\n$nocolor"
        return 1
    else
        printf "$green" ; echo "No errors found in errors.log"
        return 0
    fi
}

# Run the functions
_install || FAIL="install"
_audit || FAIL="audit"
_test || FAIL="test"

# If any of the steps fail, exit with 1
if [ "$FAIL" != "" ]; then
    printf "$boldred" ; echo -en "**Tests failed on step: '$FAIL'**\n" ;
    exit 1
else 
    printf "$green" ; echo -en "**Tests passed**\n" ;
    exit 0
fi
