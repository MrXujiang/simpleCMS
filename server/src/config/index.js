import { resolve } from 'path';
const isDev = process.env.NODE_ENV === 'development';

//获取本机ip地址
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
const staticPath = isDev ? `http://${IP}:${serverPort}` : `http://49.234.61.19:${serverPort}`;
const publicPath = resolve(__dirname, '../../public');
const appStaticPath = resolve(__dirname, '../../static');
const routerPath = resolve(__dirname, '../router');

export default {
  protocol: 'http:',
  host: 'localhost',
  serverPort,
  staticPath,
  appStaticPath,
  publicPath,
  API_VERSION_PATH: '/api/v0',
  routerPath
}