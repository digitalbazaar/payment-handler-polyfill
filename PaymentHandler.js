/*!
 * The core PaymentHandler class.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global DOMException */
'use strict';

import * as rpc from 'web-request-rpc';

import {PaymentHandlerService} from './PaymentHandlerService';

const EVENT_TYPES = ['paymentrequest', 'abortpayment'];

export class PaymentHandler extends rpc.WebApp {
  constructor(origin) {
    super(origin || window.location.origin || window.location.href);
    this._emitter = new rpc.EventEmitter({
      async waitUntil(event) {
        return event._promise || Promise.reject(
          new DOMException(
            'No "paymentrequest" event handler found.', 'NotFoundError'));
      }
    });
  }

  async connect() {
    const injector = await super.connect();

    // define API that PaymentMediator can call on this payment handler
    this.server.define('paymentHandler', new PaymentHandlerService(this));

    // auto-call `ready`
    await this.ready();

    return injector;
  }

  addEventListener(eventType, fn) {
    if(!EVENT_TYPES.includes(eventType)) {
      throw new DOMException(
        `Unsupported event type "${eventType}"`, 'NotSupportedError');
    }
    return this._emitter.addEventListener(eventType, fn);
  }

  removeEventListener(eventType, fn) {
    if(!EVENT_TYPES.includes(eventType)) {
      throw new DOMException(
        `Unsupported event type "${eventType}"`, 'NotSupportedError');
    }
    return this._emitter.removeEventListener(eventType, fn);
  }
}
