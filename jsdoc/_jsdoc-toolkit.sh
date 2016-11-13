#!/bin/sh
cd `dirname $0`
#java -jar ./jsdoc-toolkit/jsrun.jar ./jsdoc-toolkit/app/run.js ../src/*enchant.js -t=./jsdoc-toolkit/templates/codeview -d=../doc/
java -jar ./jsdoc-toolkit/jsrun.jar ./jsdoc-toolkit/app/run.js ../src/plugin/ex.enchant.js -t=./jsdoc-toolkit/templates/codeview -d=../doc/
