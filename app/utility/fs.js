'use strict';

const fs = require('fs');

const isDir = (path) => {
  return fs.existsSync(path) && fs.statSync(path).isDirectory();
};

module.exports = { isDir };
