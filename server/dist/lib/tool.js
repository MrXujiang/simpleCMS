"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uuid = uuid;
exports.xib = void 0;

function uuid(len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [],
      i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}
/**
 * 生成指定个数的随机字符转串
 * n 随机字符串的个数
 */


function generateRandomStr(n) {
  let str = 'abcdefghigklmnopqrstuvexyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_-+%$';
  let res = '';
  let len = str.length;

  for (let i = 0; i < n; i++) {
    res += str[Math.floor(Math.random() * len)];
  }

  return res;
}

const xib = {
  /**
   * 加密字符串(0, 2, 6, 7)
   */
  xip(str = '') {
    let strArr = str.split('');
    [0, 2, 6, 7].forEach((n, i) => {
      strArr.splice(n + i, 0, generateRandomStr(4));
    });
    return strArr.join('');
  },

  /**
   * 解密字符串(0, 2, 6, 7)
   */
  uxip(str = '') {
    let dotIndexArr = [0, 2, 6, 7].map((n, i) => n + i * 4);
    let res = '';
    dotIndexArr.forEach((n, i, v) => {
      res += str.slice(n + 4, v[i + 1]);
    });
    return res;
  }

};
exports.xib = xib;