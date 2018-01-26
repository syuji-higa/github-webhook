'use strict';

const rmdir = require('rmdir');
const { isDir } = require('./utility/fs');

module.exports = class DeleteBranchDir {

  /**
   * @param {Object} data
   * @param {string} data.repoDir
   * @return {Promise}
   */
  start({ repoDir }) {
    return (async () => {
      if(isDir(repoDir)) {
        await new Promise((resolve) => {
          console.log(`[delete directory start] ${ repoDir }`);
          rmdir(repoDir, (err, dirs, files) => {
            if(err) {
              console.error(err);
              return;
            }
            console.log(dirs);
            console.log(files);
            console.log(`[delete directory finish] ${ repoDir }`);
            resolve();
          });
        });
      }
    })();
  }

}
