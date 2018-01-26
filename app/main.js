'use strict';

const Koa        = require('koa');
const Router     = require('koa-router');
const bodyparser = require('koa-bodyparser');
const Webhook    = require('./middleware/github-webhook');
const { HOSTNAME, PORT, WEBHOOK_PATH, SECRET, REPO_DIR } = require('./config');

const Deploy          = require('./deploy');
const DeleteBranchDir = require('./delete-branch-dir');
const DeleteDirs      = require('./delete-dirs');

const app     = new Koa();
const router  = new Router();
const webhook = new Webhook({ path: WEBHOOK_PATH, secret: SECRET });

const deploy          = new Deploy();
const deleteBranchDir = new DeleteBranchDir();
const deleteDirs      = new DeleteDirs();

router.post('/', async ({ request }, next) => {
  const { header, body } = request;
  const {
    deleted, action, ref,
    repository: { full_name, name, ssh_url },
  } = body;

  const _event    = header['x-github-event'];
  const _repoFull = full_name;
  const _branch   = ref && ref.split('/').pop();
  const _repoDir  = `${ REPO_DIR }/${ name }--${ _branch }`;

  const _data = {
    sshUrl    : ssh_url,
    branch    : _branch,
    repoName  : name,
    repoBranch: `${ _repoFull }/${ _branch }`,
    repoDir   : _repoDir,
    repoGitDir: `${ _repoDir }/.git`,
  };

  // deploy
  if(_event === 'push' && !deleted) {
    await deploy.start(_data);
  }
  // delete branch directory
  else if(_event === 'delete') {
    await deleteBranchDir.start(_data);
  }
  // delete directorys
  else if(_event === 'repository' && action === 'deleted') {
    await deleteDirs.start(_data);
  }

  await next();
});

app
  .use(bodyparser())
  .use(webhook.gate())
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(PORT, HOSTNAME, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});
