/*!
 * A PaymentHandlerService handles remote calls to a PaymentHandler.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global DOMException */
'use strict';

import {PaymentAbortEvent} from './PaymentAbortEvent';
import {PaymentRequestEvent} from './PaymentRequestEvent';

export class PaymentHandlerService {
  constructor(paymentHandler) {
    this._paymentHandler = paymentHandler;
  }

  async requestPayment(paymentRequestEvent) {
    // TODO: validate paymentRequestEvent
    return await this._paymentHandler._emitter.emit(
      new PaymentRequestEvent(Object.assign(
        {paymentHandler: this._paymentHandler}, paymentRequestEvent)));
  }

  async abortPayment(paymentAbortEvent) {
    // TODO: validate paymentAbortEvent
    if(this._paymentHandler._emitter.listeners.length === 0) {
      // TODO: abort must fail if payment handle will not handle it
      throw new DOMException('Abort not supported', 'NotSupportedError');
    }
    return await this._paymentHandler._emitter.emit(
      new PaymentAbortEvent(paymentAbortEvent));
  }
}
