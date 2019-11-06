#!/bin/bash

buildver=`cat .buildver`
nv=`python -c "print $buildver+1"`
echo $nv > .buildver


buildver=`cat .buildver`
nvJS=`python -c "print 'window.__VERSION__=$buildver;'"`

echo $nvJS > ~/_/code/robocomposer/public/VERSION.js
echo $nvJS > ~/_/code/robocomposer/build/VERSION.js

zip -r robocomposer-N.zip build package.json public src .buildver
cp robocomposer-N.zip ~/Dropbox/RoboComposer_WebDevelopment/archives/robocomposer-v$nv.zip

echo '- - - - -'
echo '#$' robocomposer-v$nv.zip
echo '.'
ls ~/Dropbox/RoboComposer_WebDevelopment/archives/

