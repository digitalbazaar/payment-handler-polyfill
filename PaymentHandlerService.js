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
    return await this._paymentHandler.emit(
      new PaymentRequestEvent(paymentRequestEvent));
  }

  async abortPayment(paymentAbortEvent) {
    // TODO: validate paymentAbortEvent
    if(this._paymentHandler.emitter.listeners.length === 0) {
      // TODO: abort must fail if payment handle will not handle it
      throw new DOMException('Abort not supported', 'NotSupportedError');
    }
    return await this._paymentHandler.emit(
      new PaymentAbortEvent(paymentAbortEvent));
  }
}
