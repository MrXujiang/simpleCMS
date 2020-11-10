import koa from 'koa';
import server from 'koa-static';
import { resolve } from 'path';
import * as R from 'ramda';
import views from 'koa-views';
// import { initAdmin } from './service/admin';

const MIDDLEWARES = ['exception', 'common', 'router'];

const useMiddlewares = (app) => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith => initWith(app)
            ),
            require,
            name => resolve(__dirname, `./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}

// 启动逻辑
async function start() {
    const app = new koa();

    //使用模版引擎
    app.use(views(resolve(__dirname, './views'), { extension: 'pug' }));


    await useMiddlewares(app);

    // 设置静态目录
    app.use(server(resolve(__dirname, '../public')))

    app.listen('3000');
}

start()


