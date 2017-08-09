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

let loaded;
export async function loadOnce(mediatorUrl) {
  if(loaded) {
    return loaded;
  }
  return loaded = await load(mediatorUrl);
}

export async function load(mediatorUrl) {
  const polyfill = {};

  if(!mediatorUrl) {
    mediatorUrl = 'https://payment.mediator.dev:12443/mediator?origin=' +
      encodeURIComponent(window.location.origin)
  }

  //const url = 'https://bedrock.dev:18443/mediator';
  const appContext = new rpc.WebAppContext();
  const injector = await appContext.createWindow(mediatorUrl);

  // TODO: only install PaymentRequestService when appropriate
  polyfill._paymentRequestService = injector.get('paymentRequest', {
    functions: ['show', 'abort']
  });
  polyfill.permissions = injector.get('permissionManager', {
    functions: ['query', 'request', 'revoke']
  });

  // TODO: only install PaymentHandlers API when appropriate
  polyfill.PaymentHandlers = new PaymentHandlers(injector);

  // TODO: only expose PaymentHandler API when appropriate
  polyfill.PaymentHandler = PaymentHandler;

  // TODO: only expose PaymentRequest API when appropriate
  polyfill.PaymentRequest = PaymentRequest;

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
