/*!
 * A PaymentHandlerRegistration provides a PaymentManager to enable Web apps
 * to register PaymentInstruments to handle payments.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {PaymentManager} from './PaymentManager.js';

export class PaymentHandlerRegistration {
  constructor(url, injector) {
    if(!(url && typeof url === 'string')) {
      throw new TypeError('"url" must be a non-empty string.');
    }
    this.paymentManager = new PaymentManager(url, injector);
  }
}
