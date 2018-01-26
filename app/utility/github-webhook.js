'use strict';

const crypto = require('crypto');
const bl     = require('bl');

module.exports = class GithubWebhook {

  /**
   * @param {Object} options
   * @param {string} options.path
   * @param {string} options.secret
   */
  constructor(options) {
    if(typeof options !== 'object') {
      throw new TypeError('must provide an options object');
    }

    const { path, secret } = options;
    this._path   = path;
    this._secret = secret;

    if(typeof options.path !== 'string') {
      throw new TypeError('must provide a \'path\' option');
    }
    if(typeof options.secret !== 'string') {
      throw new TypeError('must provide a \'secret\' option');
    }
  }

  /**
   * @return {async}
   */
  gate() {
    return async ({ req, res }, next) => {
      const { _path, _secret } = this;
      const { url, method, headers } = req;

      if(url.split('?').shift() !== _path || method !== 'POST') {
        await next();
        return;
      }

      const _hasError = function(msg) {
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: msg }));
        throw new Error(msg);
      }

      const _sig = headers['x-hub-signature'];
      const _evt = headers['x-github-event'];
      const _id  = headers['x-github-delivery'];

      if(!_sig) _hasError('No X-Hub-Signature found on request');
      if(!_evt) _hasError('No X-Github-Event found on request');
      if(!_id)  _hasError('No X-Github-Delivery found on request');

      await new Promise((resolve) => {
        req.on('data', (data) => {
          const _computeSig = this._signBlob(_secret, data);
          if(_sig !== _computeSig) {
            _hasError('X-Hub-Signature does not match blob signature');
          }
        });
        req.on('end', resolve);
      });

      // req.pipe(bl((err, data) => {
      //   if(err) _hasError(err.message);
      //
      //   const _computeSig = this._signBlob(_secret, data);
      //
      //   if(_sig !== _computeSig) {
      //     _hasError('X-Hub-Signature does not match blob signature');
      //   }
      // }));

      await next();
    }
  }

  _signBlob(key, blob) {
    return `sha1=${ crypto.createHmac('sha1', key).update(blob).digest('hex') }`;
  }

};
