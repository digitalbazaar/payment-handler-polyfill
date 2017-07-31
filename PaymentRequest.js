/*!
 * PaymentRequest polyfill.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

import * as localforage from 'localforage';
import {PermissionManager} from 'web-request-mediator';

export class PaymentRequest {
  constructor(methodData, details, options) {
    // TODO: validate methodData
    // TODO: validate details
    // TODO: validate options

    this.id = null;
    this.shippingAddress = null;
    this.shippingOption = null
    this.shippingType = null;

    this._paymentRequestServer = navigator.paymentManager._paymentRequest;

    // TODO: reuse `EventHandler` from either `web-request-rpc` or
    //   `web-request-mediator-client` (location TBD) to implement these
    // TODO: should be setters that use `EventEmitter.removeEventListener`
    //   and `EventEmitter.addEventListener` ... also pull in
    //   `EventEmitter` from the same lib

    // attribute EventHandler onshippingaddresschange;
    // attribute EventHandler onshippingoptionchange;
  }

  async show() {
    // TODO: handle state (already shown? etc)
    if(!this.id) {
      throw new Error('InvalidStateError');
    }

    this.id = await this._paymentRequestServer.create({
      methodData: this.methodData,
      details: this.details,
      options: this.options
    });

    return this._deserializeResponse(
      await this._paymentRequestServer.show(this.id));
  }

  async abort() {
    // TODO: call something on server that will abort in-progress request
    // TODO: return void
  }

  async canMakePayment() {
    return navigator.paymentManager._paymentRequest.canMakePayment({
      methodData: this.methodData,
      details: this.details,
      options: this.options
    });
  }

  _deserializeResponse(response) {
    // TODO: convert JSON response into PaymentResponse
  }
}
