/*!
 * A PaymentHandlerRegistration provides a PaymentManager to enable Web apps
 * to handle payments.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {PaymentManager} from './PaymentManager';

export class PaymentHandlerRegistration {
  constructor(url, injector) {
    if(!(url && typeof url === 'string')) {
      throw new TypeError('"url" must be a non-empty string.');
    }

    this._url = url;
    this.paymentManager = new PaymentManager(url, {injector});
  }

  // TODO: add `on('paymentrequest')` support here

  // TODO: add `on('abortpayment')` support here
}
