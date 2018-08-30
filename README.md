[![Build Status][travis-image]][travis-url] [![dependency status][dep-image]][dep-url]

# Instructions

## Config

You must also include a 'config.js' file that contains the following code:

```
module.exports = {
  'address': (address you are sending from),
  'privateKey': (private key of address)
}
```

## Deployment

Deploy server.js as a node server on the web host of your choice.

The react app can be deployed by first building the application using

`npm run build`

before copying the build folder's contents into the static file host of your choice.

## Running The Code

Run

`npm install`

to install npm dependencies.

Open two terminals, run

`npm start`

to build the code, changes will be loaded automatically as you make them.

In the other terminal, run

`node server.js`

to run the server from which blacklisting and tx generation will take place.

## License

Copyright 2018 Tyrion70..
Original Copyright 2018 bitfwd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis-image]: https://travis-ci.org/TyrionShared/wanchain-faucet.svg
[travis-url]: https://travis-ci.org/TyrionShared/wanchain-faucet
[dep-image]: https://david-dm.org/TyrionShared/wanchain-faucet.svg
[dep-url]: https://david-dm.org/TyrionShared/wanchain-faucet
