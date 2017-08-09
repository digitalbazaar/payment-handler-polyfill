/*!
 * A PaymentManager for a Web Payment Mediator.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

import {utils} from 'web-request-rpc';

import {PaymentInstruments} from './PaymentInstruments';

export class PaymentManager {
  constructor(url, injector) {
    if(!(url && typeof url === 'string')) {
      throw new TypeError('"url" must be a non-empty string.');
    }
    this.instruments = new PaymentInstruments(url, injector);
  }

  /**
   * Requests that the user grant 'paymenthandler' permission to the current
   * origin.
   *
   * @return a Promise that resolves to the new PermissionState of the
   *           permission (e.g. 'granted'/'denied').
   */
  static async requestPermission() {
    return navigator.paymentPolyfill.permissions.request(
      {name: 'paymenthandler'}).state;
  }
}
