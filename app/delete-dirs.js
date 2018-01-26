'use strict';

const rmdir = require('rmdir');
const { readdir } = require('fs');
const { isDir } = require('./utility/fs');
const { REPO_DIR } = require('./config');

module.exports = class DeleteDirs {

  /**
   * @param {Object} data
   * @param {string} data.repoName
   * @return {Promise}
   */
  start({ repoName }) {
    return (async () => {
      const _dirBase = `${ REPO_DIR }/${ repoName }--`;
      console.log(`[delete directorys start] ${ _dirBase }*`);
      const _dirs = await new Promise((resolve) => {
        readdir(REPO_DIR, (err, paths) => {
          if(err) {
            console.error(err);
            return;
          }
          resolve(paths.map((path) => {
            return `${ REPO_DIR }/${ path }`;
          }));
        });
      });
      const _deleteDirs = await new Promise((resolve) => {
        const _delDirs = _dirs.filter((dir) => {
          return isDir(dir) && dir.match(new RegExp(`${ _dirBase }.+$`));
        });
        resolve(_delDirs);
      });
      await Promise.all(_deleteDirs.map((dir) => {
        return new Promise((resolve) => {
          console.log(`[delete directory start] ${ dir }`);
          rmdir(dir, (err, dirs, files) => {
            if(err) {
              console.error(err);
              return;
            }
            console.log(dirs);
            console.log(files);
            console.log(`[delete directory finish] ${ dir }`);
            resolve();
          });
        });
      }));
      console.log(`[delete directorys finish] ${ _dirBase }*`);
    })();
  }

}
