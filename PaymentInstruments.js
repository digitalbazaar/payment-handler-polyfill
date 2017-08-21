/*!
 * API for managing PaymentInstruments.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global Image */
'use strict';

export class PaymentInstruments {
  constructor(url, injector) {
    const remote = injector.get('paymentInstruments', {
      functions: ['delete', 'get', 'keys', 'has', 'set', 'clear']
    });
    for(let methodName in remote) {
      if(methodName !== 'set') {
        this[methodName] = remote[methodName].bind(this, url);
      }
    }
    this._remoteSet = remote.set.bind(this, url);
  }

  async set(instrumentKey, paymentInstrument) {
    // TODO: validate payment instrument

    // ensure images are prefetched so that they will not leak information
    // when fetched later
    paymentInstrument.icons = paymentInstrument.icons || [];
    const promises = paymentInstrument.icons.map(icon =>
      imageToDataUrl(icon.src).then(fetchedImage => {
        icon.fetchedImage = fetchedImage;
      }));
    await Promise.all(promises);
    return this._remoteSet(instrumentKey, paymentInstrument);
  }
}

function imageToDataUrl(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
      canvas = null;
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
