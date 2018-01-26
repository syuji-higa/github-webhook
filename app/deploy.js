'use strict';

const simpleGit = require('simple-git');
const { mkdirSync } = require('fs');
const { exec } = require('child_process');
const { isDir } = require('./utility/fs');

module.exports = class Deploy {

  /**
   * @param {Object} data
   * @param {string} data.sshUrl
   * @param {string} data.branch
   * @param {string} data.repoBranch
   * @param {string} data.repoDir
   * @param {string} data.repoGitDir
   * @return {Promise}
   */
  start({ sshUrl, branch, repoBranch, repoDir, repoGitDir }) {
    return (async () => {

      // not has repository
      if(!isDir(repoDir)) {
        console.log(`[create directory start] ${ repoDir }`);
        mkdirSync(repoDir, '755');
        console.log(`[create directory finish] ${ repoDir }`);
      }

      // not has git
      if(!isDir(repoGitDir)) {
        console.log(`[git init start] ${ repoBranch }`);
        await new Promise((resolve) => {
          simpleGit(repoDir).init(repoDir, (err) => {
            if(err) console.error(err);
            resolve();
          });
        });
        console.log(`[git init finish] ${ repoBranch }`);

        console.log(`[git sparse checkout 'true' start] ${ repoBranch }`);
        await new Promise((resolve) => {
          simpleGit(repoDir).addConfig('core.sparsecheckout', true, (err) => {
            if(err) console.error(err);
            resolve();
          });
        });
        console.log(`[git sparse checkout 'true' finish] ${ repoBranch }`);

        console.log(`[git add remote start] ${ repoBranch }`);
        await new Promise((resolve) => {
          simpleGit(repoDir).addRemote('origin', sshUrl, (err) => {
            if(err) console.error(err);
            resolve();
          });
        });
        console.log(`[git add remote finish] ${ repoBranch }`);

        console.log(`[git add checkout dirctory start] ${ repoBranch }`);
        await new Promise((resolve) => {
          exec(`echo htdocs/ > ${ repoDir }/.git/info/sparse-checkout`, (err) => {
            if(err) console.error(err);
            resolve();
          });
        });
        console.log(`[git add checkout dirctory finish] ${ repoBranch }`);

        console.log(`[git checkout start] ${ repoBranch }`);
        await new Promise((resolve) => {
          simpleGit(repoDir).checkoutLocalBranch(branch, (err) => {
            if(err) console.error(err);
            resolve();
          });
        });
        console.log(`[git checkout finish] ${ repoBranch }`);
      }

      console.log(`[git pull start] ${ repoBranch }`);
      await new Promise((resolve) => {
        simpleGit(repoDir).pull('origin', branch, (err, update) => {
          if(err) console.error(err);
          if(update) console.log(update);
          resolve();
        });
      });
      console.log(`[git pull finish] ${ repoBranch }`);

    })();
  }

}
