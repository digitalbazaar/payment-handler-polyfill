/*!
 * Payment Handler API Polyfill.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import * as rpc from 'web-request-rpc';

import {PaymentHandlers} from './PaymentHandlers';

export async function load() {
  const polyfill = {};

  const url = 'https://bedrock.dev:18443/mediator';
  const serverContext = new rpc.ServerContext();
  const injector = await serverContext.createWindow(url);

  // TODO: only install PaymentRequestService when appropriate
  polyfill._paymentRequestService = injector.get('paymentRequest', {
    ['create', 'show', 'abort']
  });
  polyfill.permissions = injector.get('permissionManager', {
    functions: ['request', 'query', 'revoke']
  });

  // TODO: only install PaymentHandlers API when appropriate
  polyfill.PaymentHandlers = new PaymentHandlers(injector);

  // expose polyfill
  navigator.paymentPolyfill = polyfill;

  return polyfill;
};
