/*!
 * API for managing PaymentInstruments.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

export class PaymentInstruments {
  constructor(url, injector) {
    const remote = injector.get('paymentInstruments', {
      functions: ['delete', 'get', 'keys', 'has', 'set', 'clear']
    });
    for(let methodName in remote) {
      this[methodName] = remote[methodName].bind(this, url);
    }
  }
}
