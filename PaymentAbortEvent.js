/*!
 * A PaymentAbortEvent is emitted when a request has been made to abort
 * a payment.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global Event */

// can't use "ExtendableEvent"; only accessible from Workers
// TODO: may not be able to even extend `Event` here; could produce "incorrect"
//   core attributes
export class PaymentAbortEvent /*extends Event*/ {
  constructor({
    topLevelOrigin,
    paymentRequestOrigin,
    paymentRequestId
  }) {
    //super('paymentabort');
    this.type = 'paymentabort';
    this.topLevelOrigin = topLevelOrigin;
    this.paymentRequestOrigin = paymentRequestOrigin;
    this.paymentRequestId = paymentRequestId;
  }

  respondWith(handlerResponse) {
    // TODO: throw exception is `_promise` is already set

    // TODO: validate handlerResponse
    this._promise = handlerResponse;
  }
}
