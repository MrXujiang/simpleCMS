"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

const isDev = process.env.NODE_ENV === 'development'; //获取本机ip地址

function getIPAdress() {
  var interfaces = require('os').networkInterfaces();

  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];

      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

const IP = getIPAdress();
const serverPort = isDev ? 3000 : 3000;
const staticPath = isDev ? `http://${IP}:${serverPort}` : `http://${IP}:${serverPort}`;
const publicPath = (0, _path.resolve)(__dirname, '../../public');
const appStaticPath = (0, _path.resolve)(__dirname, '../../static');
const routerPath = (0, _path.resolve)(__dirname, '../router');
var _default = {
  protocol: 'http:',
  host: 'localhost',
  serverPort,
  staticPath,
  appStaticPath,
  publicPath,
  API_VERSION_PATH: '/api/v0',
  routerPath
};
exports.default = _default;