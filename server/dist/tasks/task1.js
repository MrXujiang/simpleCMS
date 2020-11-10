"use strict";

const cp = require('child_process');

const {
  resolve
} = require('path');

;

(async () => {
  const script = resolve(__dirname, '../crawler/index'); // 创建子进程

  const child = cp.fork(script, []);
  let invoked = false;
  child.on('error', err => {
    if (invoked) return;
    invoked = true;
    console.log(err);
  });
  child.on('exit', code => {
    if (invoked) return;
    invoked = false;
    let err = code === 0 ? null : new Error('exit code ' + code);
    console.log(err);
  });
  child.on('message', data => {
    console.log(data);
  });
})();