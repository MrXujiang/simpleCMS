"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (state = 200, result = null, msg = '') => {
  return {
    state,
    result,
    msg
  };
};

exports.default = _default;