'use strict';

const { HOSTNAME, PORT } = process.env;

module.exports = {
  HOSTNAME    : HOSTNAME || '127.0.1.1',
  PORT        : PORT || 3000,
  WEBHOOK_PATH: '/',
  SECRET      : '',
  REPO_DIR    : '/home/user/repo.xxxxx.xxx',
};
