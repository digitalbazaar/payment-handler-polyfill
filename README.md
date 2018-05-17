# payment-handler-polyfill
A polyfill for the [Payment Handler API][]

See https://github.com/digitalbazaar/payment-handler-demo for a demonstration.

## API Differences with [Payment Handler API][]

TODO: introduction of `PaymentHandlers` global with API:

* register(url) - registers a payment handler identified by `url` that
  will be loaded when a related payment instrument is selected by the user...
  as opposed to registering a service worker. Result is a Promise that resolves
  to a `PaymentHandlerRegistration` instance with a `paymentManager` API (just
  like a service worker registration). This can be used to register
  payment instruments via `paymentManager.paymentInstruments` using the same
  API as the official spec.
* unregister(url) - unregisters a payment handler and removes any stored
  payment instruments.


TODO: PaymentRequest API is the same, but some important notes:

There are three scenarios that this polyfill considers (and changes its
behavior accordingly):

1. A browser that has implemented both PaymentRequest and PaymentHandler.
2. A browser that has implemented PaymentRequest but not PaymentHandler.
3. A browser that has not implemented PaymentRequest or PaymentHandler.

Under scenario 1, this polyfill will not expose or override any existing
native APIs.

Under scenario 2, this polyfill will expose the `PaymentHandlers` polyfill
API but will only override `PaymentRequest` if one ore more PaymentInstruments
have been registered via the polyfill. Otherwise the native `PaymentRequest`
API will be used.

Under scenario 3, this polyfill will expose `PaymentHandlers` and its own
version of `PaymentRequest`.

TODO: Note that the polyfill design presently allows for the above
considerations but in its current state the polyfill does not automatically
override any native behavior. The polyfill simply exposes its features under
its own namespace:

```js
navigator.paymentPolyfill.*
```

Websites using the polyfill may add their own code to configure which
aspects of the polyfill they wish to expose via standard APIs.

### Loading the polyfill

Usage:

```js
import * as polyfill from 'payment-handler-polyfill';

// Note: there is a demo payment mediator running at this URL that
// can be used for testing
//const MEDIATOR_ORIGIN = 'https://payment-mediator.demo.digitalbazaar.com';

// MEDIATOR_ORIGIN is expected to default to 'https://web-payments.io' in
// the future
await polyfill.loadOnce(
  MEDIATOR_ORIGIN + '/mediator?origin=' +
  encodeURIComponent(window.location.origin));
```

### Registering a Payment Handler

Usage:

```js
const PaymentManager = navigator.paymentPolyfill.PaymentManager;

async function install() {
  // request permission to install a payment handler
  const result = await PaymentManager.requestPermission();
  if(result !== 'granted') {
    throw new Error('Permission denied.');
    return;
  }

  // get payment handler registration
  const registration = await PaymentHandlers.register('/payment-handler');

  await addInstruments(registration);
}

async function addInstruments(registration) {
  return Promise.all([
    registration.paymentManager.instruments.set(
      // this could be a UUID -- any 'key' understood by this payment handler
      'default',
      {
        name: 'Visa *1234',
        icons: [{
          src: '/images/new_visa.gif',
          sizes: '40x40',
          type: 'image/gif'
        }],
        enabledMethods: ['basic-card'],
        capabilities: {
          supportedNetworks: ['visa'],
          supportedTypes: ['credit', 'debit', 'prepaid']
        }
      })
    ]);
}
```

### Requesting Payment

```js
const PaymentRequest = navigator.paymentPolyfill.PaymentRequest;

async function pay() {
  try {
    // request payment by credit card for $1 USD
    const pr = new PaymentRequest([{
      supportedMethods: ['basic-card']
    }], {
      total: {
        label: 'Total',
        amount: {currency: 'USD', value: '1.00'}
      }
    });
    const response = await pr.show();
    console.log('payment response', response);
  } catch(e) {
    console.error(e);
  }
};
```

### Handling a Payment Request in the Payment Handler

This code must run when the browser requests the URL registered as
a payment handler (e.g. '/credential-handler'). It is similar to running
a Service Worker but will work in browsers that have no implemented the
Service Worker specification.

Usage:

```js
const PaymentHandler = navigator.paymentPolyfill.PaymentHandler;
const handler = new PaymentHandler(MEDIATOR_ORIGIN);

handler.addEventListener('paymentrequest', event => {
  event.respondWith(new Promise(async (resolve, reject) => {
    let windowClient;

    window.addEventListener('message', e => {
      // ignore messages we don't care about
      if(!(e.source === windowClient &&
        e.origin === window.location.origin)) {
        return;
      }

      // wait for 'request' message from the window we opened requesting the
      // payment request details
      if(e.data.type === 'request') {
        // send the window we opened the payment request details
        return windowClient.postMessage({
          topLevelOrigin: event.topLevelOrigin,
          methodData: event.methodData,
          total: event.total,
          instrumentKey: event.instrumentKey
        }, window.location.origin);
      }

      if(e.data.type === 'response') {
        // we've received the payment response from the window we opened,
        // send it back to the browser, we're done!
        resolve(e.data.response);
      }
    });

    // open a window to show a UI to handle the payment request; it will
    // send us a message requesting the payment request details when it's ready
    windowClient = await event.openWindow('/paymentrequest');
  }));
});

// connect to the mediator and await an event
await handler.connect();
```

[Payment Handler API]: https://w3c.github.io/payment-handler/
