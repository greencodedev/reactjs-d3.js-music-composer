#!/bin/bash

buildver=`cat .buildver`
nvJS=`python -c "print 'window.__VERSION__=$buildver'"`

echo $nvJS > ~/_/code/robocomposer/public/VERSION.js
echo $nvJS > ~/_/code/robocomposer/build/VERSION.js