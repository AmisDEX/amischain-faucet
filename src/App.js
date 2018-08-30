import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      'address': '',
      'recaptcha': '',
    };
    this.notificationSystem = null;

    this.addNotification = this.addNotification.bind(this);
    this.handleCaptchaResponse = this.handleCaptchaResponse.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  addNotification(type, response) {
    let action;
    if (type === 'success') {
      action = {
        label: 'View Transaction',
        callback: function() {
          window.open('https://wanscan.io/tx/' + response);
        }
      }
    }
    switch(type) {
      case 'success':
        this.notificationSystem.addNotification({
          message: 'Transaction Successful!',
          level: type,
          position: 'bc',
          action: action
        });
        break;
      case 'error':
        if (response === 'IP address temporarily blacklisted.') {
          this.notificationSystem.addNotification({
            message: "We only drip 0.06 WAN per user per day, please try again tomorrow.",
            level: type,
            position: 'bc'
          });
        } else if (response === 'Invalid Recaptcha.') {
          this.notificationSystem.addNotification({
            message: "Invalid recaptcha response, try again.",
            level: type,
            position: 'bc'
          });
        } else if (response === 'Empty address field.'){
          this.notificationSystem.addNotification({
            message: "Address field cannot be empty.",
            level: type,
            position: 'bc'
          })
        } else {
          this.notificationSystem.addNotification({
            message: 'Transaction Unsuccessful!',
            level: type,
            position: 'bc'
          });
        }
        break;
      default:
        break;
    }
  }

  handleChange(e) {
    this.setState({ 'address': e.target.value});
  }

  async handleSubmit(e) {
    e.preventDefault();
    window.grecaptcha.reset();
    let address = this.state.address;
    let recaptcha = this.state.recaptcha;
    const url = 'https://wanfaucet.net/api/eth_sendRawTransaction';

    let type = '';
    let response;
    let txHash = '';
    let post_error = false;

    try {
      response = await axios({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          'address': address,
          'g-recaptcha-response': recaptcha
        })
      })
    } catch(e) {
      post_error = true;
      type = 'error';
      txHash = e.response.data;
    }

    if (!post_error) {
      if (response['data']) {
        type = 'success';
        txHash = response.data;
      }
    }

    this.addNotification(type, txHash);

    this.setState({ 'address': ''});
  }

  handleCaptchaResponse(response) {
    this.setState({ 'recaptcha': response })
  }

  render() {
    return (
      <div>
        <div className="notice">
          Please make a donation or add to the faucet if you find this site useful!
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="row padding-bottom">
                <div className="col">
                  <h1>Tyrion70's Wanchain Faucet</h1>
                </div>
              </div>
              <div className="row padding-bottom">
                <div className="col">
                  <h4>Instantly Get Wancoins to fund your OTA Transactions<span className="txt-blue">.</span></h4>
                </div>
              </div>
              <div className="row padding-bottom">
                <div className="col">
                  <ul className="features-list">
                    <li>Community Driven</li>
                    <li>Instant</li>
                    <li>Free</li>
                  </ul>
                </div>
              </div>
              <div className="row">
                <form onSubmit={this.handleSubmit} style={{width: "100%"}}>
                  <input className="fwd-input" style={{width: "65%", marginRight: "8px"}} placeholder="Your Wanchain Address" type="text" value={this.state.address} onChange={this.handleChange} />
                  <ReCAPTCHA sitekey="6LdJqWoUAAAAAPbwbB1w67jXMvKuy5cnC2cNX9Gu" onChange={this.handleCaptchaResponse} />
                  <input className="fwd-btn" style={{width: "30%"}} type="submit" value="Get WAN!" />
                </form>
                <br />
                <NotificationSystem ref="notificationSystem" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="row">
                <div className="col">
                  <div className="hspace d-block d-md-none"></div>
                </div>
              </div>
              <div className="row" style={{paddingTop: "50px", paddingBottom: "50px"}}>
                <div className="col">
                </div>
              </div>
            </div>
          </div>
          <footer className="row" style={{paddingTop: "40px"}}>
            <div className="col">
              <center><a href="https://t.me/tyrion70" target="_blank" rel="noopener noreferrer">telegram</a> - <a href="https://twitter.com/tyrion70" target="_blank" rel="noopener noreferrer">twitter</a></center>
              <center>Donations: <a href="https://wanscan.io/addr/0x664949908413517B993c6784b44428d080D1a1Fa" target="_blank" rel="noopener noreferrer">0x664949908413517B993c6784b44428d080D1a1Fa</a></center>
              <center>Fund faucet: <a href="https://wanscan.io/addr/0x498ee678C15175DDD23fd1b4716D337E84D2297C" target="_blank" rel="noopener noreferrer">0x498ee678C15175DDD23fd1b4716D337E84D2297C</a></center>
              <center><a href="https://www.ledger.com/products/ledger-nano-s?r=651b52292b63" target="_blank" rel="noopener noreferrer">Don't have a Ledger? Get one today.</a></center>
              <center><a href="https://shop.trezor.io?a=mywanwallet.nl" target="_blank" rel="noopener noreferrer">Don't have a TREZOR? Get one now.</a></center>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default App;
