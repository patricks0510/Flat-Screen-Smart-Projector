#!/usr/bin/env bash
npm i yarn --global &&
yarn create electron-app my-app --template=webpack &&

cd my-app &&
yarn add react react-dom &&
npm i bootstrap standard react-bootstrap &&
yarn add -D @babel/core babel-loader @babel/preset-env @babel/preset-react &&

cd .. &&
cp -fr ./source/.babelrc ./my-app &&
cp -fr ./source/webpack.renderer.config.js ./my-app &&
cp -fr ./source/package.json ./my-app &&
cp -fr ./source/App.js ./my-app/src &&
cp -fr ./source/index.html ./my-app/src &&
cp -fr ./source/main.js ./my-app/src &&
cp -fr ./source/renderer.js ./my-app/src &&

cd my-app &&
npm start