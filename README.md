# payment-handler-polyfill
A polyfill for the Payment Handler API

## API Differences with [Payment Handler API 1.0]()

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

### Example Payment Handler

Usage:

```js
const handler = new PaymentHandler();

andler.addEventListener('paymentrequest', event => {
  // TODO: handle event
});

handler.addEventListener('paymentabort', event => {
  // TODO: handle event
});

await handler.connect();
```
