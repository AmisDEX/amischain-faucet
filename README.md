# Wanchain Faucet

[![CircleCI][circle-image]][circle-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![dependency status][dep-image]][dep-url]

# Instructions

## Config

You must include a 'config.js' file. See config.js.sample for an example

## Deployment

The react app can be deployed by first building the application using

`npm run build`

before copying the build folder's contents into the static file host of your choice.

To run server.js with pm2 type

`npm run start-server`

to stop type 

`npm run start-server`

to view logs type

`npm run logs-server`

## Development

Run

`npm install`

to install npm dependencies.

Open two terminals, run

`npm start`

to build the code, changes will be loaded automatically as you make them.

In the other terminal, run

`node server.js`

to run the server from which blacklisting and tx generation will take place.

Mind to change the url of the backendserver in src/App.js

## Docker

a Dockerfile to run the static html in an nginx container is available. To use it build the statics with

`npm run build`

then create the docker container with

`docker build -t wanchain-faucet .`

`docker run --name wanchain-faucet -d -p 3000:80 wanchain-faucet`

## License

Copyright 2018 Tyrion70..

Original Copyright 2018 bitfwd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[dep-image]: https://david-dm.org/C3Devs/wanchain-faucet.svg
[dep-url]: https://david-dm.org/C3Devs/wanchain-faucet
[circle-image]: https://circleci.com/gh/C3Devs/wanchain-faucet.svg?style=svg
[circle-url]: https://circleci.com/gh/C3Devs/wanchain-faucet
[coveralls-image]: https://coveralls.io/repos/github/C3Devs/wanchain-faucet/badge.svg?branch=dev
[coveralls-url]: https://coveralls.io/github/C3Devs/wanchain-faucet?branch=dev
