/*!
 * Provides an API for working with PaymentHandlerRegistrations.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {PaymentHandlerRegistration} from './PaymentHandlerRegistration';

export class PaymentHandlers {
  constructor(injector) {
    this._injector = injector;
    this._remote = injector.get('paymentHandlers', {
      functions: [
        'register', 'unregister', 'getRegistration', 'hasRegistration']
    });
  }

  /**
   * Creates a payment handler registration.
   *
   * @param url the unique URL for the payment handler.
   *
   * @return a Promise that resolves to the PaymentHandlerRegistration.
   */
  async register(url) {
    // register with payment mediator
    url = await this._remote.register(url);
    return new PaymentHandlerRegistration(url, this._injector);
  }

  /**
   * Unregisters a payment handler, destroying its registration.
   *
   * @param url the unique URL for the payment handler.
   *
   * @return a Promise that resolves to `true` if the handler was registered
   *           and `false` if not.
   */
  async unregister(url) {
    // unregister with payment mediator
    return this._remote.unregister(url);
  }

  /**
   * Gets an existing payment handler registration.
   *
   * @param url the URL for the payment handler.
   *
   * @return a Promise that resolves to the PaymentHandlerRegistration or
   *           `null` if no such registration exists.
   */
  async getRegistration(url) {
    url = await this._remote.getRegistration(url);
    if(!url) {
      return null;
    }
    return new PaymentHandlerRegistration(url, this._injector);
  }

  /**
   * Returns true if the given payment handler has been registered and
   * false if not.
   *
   * @param url the URL for the payment handler.
   *
   * @return a Promise that resolves to `true` if the registration exists and
   *           `false` if not.
   */
  async hasRegistration(url) {
    return await this._remote.hasRegistration(url);
  }
}
