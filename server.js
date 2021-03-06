const EthereumTx = require('ethereumjs-tx');
const wanUtil = require('wanchain-util');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const touch = require('touch');
const moment = require('moment');
const querystring = require('querystring');

const config = require('./config.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.options('/api/eth_sendRawTransaction', cors());

const privateKey = config.privateKey;
const key = Buffer.from(privateKey, 'hex');
const url = 'https://mywanwallet.nl/api/';
const blacklistTime = 1440; //mins
const recaptchaSecret = config.recaptchaSecret;

var Tx = wanUtil.wanchainTx;

// get nonce in future using 'getTransactionCount'
// Generate raw tx
function generateTx(nonce, to) {
  const amount = 60000000000000000;
  const value = '0x' + parseInt(amount).toString(16);
  const txParams = {
    Txtype: 1,
    nonce: nonce,
    gasPrice: '0x29E8D60800',
    gasLimit: '0xc350',
    to: to,
    value: value
  }

  const tx = new Tx(txParams)
  tx.sign(key);
  const serializedTx = tx.serialize();
  return serializedTx.toString('hex');
}

// create temporary working director for IP blacklist
function setupBlacklist(path) {
  try {
    fs.mkdir(path, function(err) {});
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  return true
}

// use blacklist to detemine ether eligbility
  // stat the file, if virgin touch the file and release the ether
  // if file exists check modified date
  // < 60 mins reject
  // > 60 mins touch the file and release
function releaseEther(ipPath,addrPath) {
  try {
    let stats = fs.statSync(addrPath);
    
    // if not error this address was used.. 
    return false;
  } 
  catch (err) {
    try {
      let stats = fs.statSync(ipPath);

      // mtime sample 2017-12-29T14:24:26.472Z
      var mtime = moment(stats['mtime']);
      var now = moment();
      var duration = moment.duration(now.diff(mtime));

      if (duration.asMinutes() > blacklistTime) {
          return true;
      } else {
          console.log(ipPath + ' - blacklisted')
          return false;
      }
    }
    catch (err) {
        return true;
    }
  }
}

// Make id same as nonce for simplicity
app.post('/api/eth_sendRawTransaction', cors(), async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('received request');

  if (!req.body.address) return res.status(422).send('Empty address field.');

  // get IP address and set up paths
  let ip = req.headers['cf-connecting-ip'] || req.connection.remoteAddress;
  let path = "/tmp/faucet/"
  let ipPath = path + ip
  let addrPath = path + req.body.address
  setupBlacklist(path)

  // check captcha
  let captchaResponse;
  try {
    captchaResponse = await axios({
      method: 'POST',
      url: 'https://www.google.com/recaptcha/api/siteverify',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: querystring.stringify({
        'response': req.body['g-recaptcha-response'],
        'secret': recaptchaSecret
      })
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }

  if (!captchaResponse.data.success) return res.status(409).send('Invalid Recaptcha.');
  if (captchaResponse.data.hostname != ip) console.log('Captcha was not solved at host ip');

  // release variable below determines whether IP is blacklisted
  let release = releaseEther(ipPath, addrPath)
  if (!release) {
    res.status(429).send('IP address temporarily blacklisted.');
    return false;
  }

  const to = req.body.address;
  let response;
  try {
    response = await axios({
      method: 'POST',
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getTransactionCount",
        "params": [config.address, "latest"]
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }
  let txCount = response.data.result;

  let done = false;

  while (!done) {
    console.log('attempting to send');
    let rawTx = "0x" + generateTx(txCount, to);
    let params = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_sendRawTransaction",
      "params": [rawTx]
    };

    error = false;
    try {
      response = await axios({
        method: 'POST',
        url: url,
        headers: {
          "Content-Type": "application/json"
        },
        data: params
      });
      if (typeof response.data.result != "undefined") {
        touch.sync(ipPath)
        touch.sync(addrPath)
        done = true;
      } else if (response.data.error.message != "undefined") {
        if (response.data.error.message == "nonce too low") {
          txCount++;
        } else {
          // other error occurred
          console.log(response.data.error.message)
          done = true;
          error = true;
        }
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500);
    }
  }

  if (response.status != 200) return res.status(500);

  if (error) {
    return res.status(503).send(response.data.error.message);
  } else {
    res.send(response.data.result);
  }
})

app.listen(process.env.PORT, () => {
  console.log('Wanchain faucet listening on port', process.env.PORT);
})
