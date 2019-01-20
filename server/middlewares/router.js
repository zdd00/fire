import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply';
import wechatMiddle from '../wechat-lib/middleware';

export const router = app => {
  const router = new Router()
  router.all('/wechat-hear', wechatMiddle(config.wechat, reply))
  // router.get('/wechat-hear', (ctx, next) => {
  //   require('../wechat')
  //   getWechat()
  // })
  app.use(router.routes()).use(router.allowedMethods())
}
