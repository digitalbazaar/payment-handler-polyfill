/*!
 * Payment Handler API Polyfill.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import * as rpc from 'web-request-rpc';

import {PaymentHandler} from './PaymentHandler';
import {PaymentHandlers} from './PaymentHandlers';
import {PaymentRequest} from './PaymentRequest';

export async function load() {
  const polyfill = {};

  const url = 'https://bedrock.dev:18443/mediator';
  const appContext = new rpc.WebAppContext();
  const injector = await appContext.createWindow(url);

  // TODO: only install PaymentRequestService when appropriate
  polyfill._paymentRequestService = injector.get('paymentRequest', {
    ['create', 'show', 'abort']
  });
  polyfill.permissions = injector.get('permissionManager', {
    functions: ['request', 'query', 'revoke']
  });

  // TODO: only install PaymentHandlers API when appropriate
  polyfill.PaymentHandlers = new PaymentHandlers(injector);

  // TODO: only expose PaymentHandler API when appropriate
  polyfill.PaymentHandler = PaymentHandler;
  /* Usage:
  const handler = new PaymentHandler();

  handler.addEventListener('paymentrequest', event => {
    // TODO: handle event
  });

  handler.addEventListener('paymentabort', event => {
    // TODO: handle event
  });

  await handler.connect();
  */

  // expose polyfill
  navigator.paymentPolyfill = polyfill;

  return polyfill;
};
