/*!
 * A PaymentRequestEvent is emitted when a request has been made for payment.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global Event */
'use strict';

import * as rpc from 'web-request-rpc';

// can't use "ExtendableEvent"; only accessible from Workers
// TODO: may not be able to even extend `Event` here; could produce "incorrect"
//   core attributes
export class PaymentRequestEvent extends Event {
  constructor({
    paymentHandler,
    topLevelOrigin,
    paymentRequestOrigin,
    paymentRequestId,
    methodData,
    total,
    modifiers,
    instrumentKey
  }) {
    super('paymentrequest');
    this._paymentHandler = paymentHandler;
    this.topLevelOrigin = topLevelOrigin;
    this.paymentRequestOrigin = paymentRequestOrigin;
    this.paymentRequestId = paymentRequestId;
    this.methodData = methodData;
    this.total = total;
    this.modifiers = modifiers;
    this.instrumentKey = instrumentKey;
  }

  async openWindow(url) {
    // TODO: disallow more than one call

    // TODO: ensure `url` is to the same origin
    await this._paymentHandler.show();
    const clientWindow = new rpc.ClientWindow(url);
    clientWindow.ready();
    clientWindow.show();
    // TODO: note that `ClientWindow` is not a ServiceWorker
    //   `WindowClient` polyfill... could be confusing here, should we
    //   implement a `ClientWindow`? -- potentially by just renaming
    //   `ClientWindow` to `WindowClient`... there is, for example,
    //   a `navigate` call on WindowClient that enforces same origin, would
    //   need to attempt to add or approximate that
    return clientWindow.handle;
  }

  respondWith(handlerResponse) {
    // TODO: throw exception if `_promise` is already set

    // TODO: validate handlerResponse
    this._promise = handlerResponse;
  }
}
