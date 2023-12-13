#!/bin/bash
git checkout .
git pull
NODE_VERSION=$(node -p -e "require('./package.json').version")
NEXTVERSION=$(echo ${NODE_VERSION} | awk -F. -v OFS=. '{$NF += 1 ; print}')
echo "Updating code"
tag="$(date +'%Y-%m-%d-%H-%M')-${NODE_VERSION}"
echo "${tag}"
rm -rf build build.zip
echo "Chat AI Project Clean Install ..."
sh chat-ai-admin-fe/deploy.sh
echo "Chat AI Clean Install ..."
npm i --legacy-peer-deps
echo "Eslint check ..."
npx eslint --ext .js --ext .jsx  --ext .ts --ext .tsx ./src ./test
echo "Building ..."
sleep 2
# npm run build
export ASSET_PATH=$2 && npm run build
sleep 2
if [ -d build ]
then
    echo "----------------Build success----------------"
    echo "Removing old build"
    git tag -a $tag  -m "Automated Release"
    git push origin $tag
    rm -rf /opt/build/*
    #rm -rf dist
    echo "Removed old build"
    echo "Coping new build in dist folder"
    #cp -R build dist
    #rm -rf dist.zip
    cp -R img/* build/img/
    cp -R build/ /opt/build/
    zip -r build.zip build/
    cp build.zip /Users/actolap/Data/Dropbox/
    git checkout development
    git pull
    DEV_VERSION=$(node -p -e "require('./package.json').version")
    echo "${DEV_VERSION}"
    if [ $NEXTVERSION != $DEV_VERSION ]
    then
    echo "Bumping the version"
    sed -i '' "s/${DEV_VERSION}/${NEXTVERSION}/" package.json
    git commit --no-verify package.json -m "Bump Version Automated"
    git push origin    
    fi
    git checkout uat
else
    echo "----------------Build Failed----------------"
fi