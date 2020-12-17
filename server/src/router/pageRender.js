import fs, { readFile } from "fs";
import { delFile, WF, RF } from "../lib/upload";
import { uuid } from "../lib/tool";
import { auth } from "../service";
import config from "../config";
import htr from "../lib/htr";

const formatTime = (timeStemp, flag = '/') => {
  let date = new Date(timeStemp);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  return `${y}${flag}${m}${flag}${d}`
}
/**
 * 文章路由
 * @param {*} router
 * @param {*} apiPath
 * 待优化：1.将成功响应和失败响应统一封装
 */
const pageRenderRouter = (router) => {
  // api路径
  const api = {
    login: "/login",
    registered: "/registered",
    home: "/",
    detail: "/detail",
    cates: "/cates",
    about: "/about"
  };

  // 登录
  router.get(api.login, async (ctx) => {
    await ctx.render("login", {
      url: api.login,
      title: "登录",
      description: "新用户?",
      href: "去注册",
      firstInput: "邮箱",
      twoInput: "密码",
      btnText: "登录",
      logoText: "趣写",
    });
  });

  // 注册
  router.get(api.registered, async (ctx) => {
    await ctx.render("login", {
      url: api.registered,
      title: "注册",
      description: "已经有账户?",
      href: "去登录",
      firstInput: "邮箱",
      twoInput: "密码",
      threeInput: "用户名",
      btnText: "注册",
      logoText: "趣写",
    });
  });

  // 渲染首页
  router.get(api.home, async (ctx) => {
    const filePath = `${config.publicPath}/db/ads.json`;
    const articleIdxPath = `${config.publicPath}/db/article_index.json`
    const ads = RF(filePath);
    let articleIdxs = RF(articleIdxPath);
    articleIdxs = articleIdxs.map(item => {
      return {
        ...item,
        ct: formatTime(item.ct)
      }
    })
    const topArticles = articleIdxs.filter(item => !!item.top);
    console.log({
      ads,
      tops: topArticles,
      list: articleIdxs
    })
    await ctx.render("index", {
      ads,
      tops: topArticles,
      list: articleIdxs
    });
  });

  // 渲染详情页
  router.get(api.detail, async (ctx) => {
    const id = ctx.query.fid;
    const articlePath = `${config.publicPath}/db/articles/${id}.json`;
    const commentPath = `${config.publicPath}/db/comments/${id}.json`
    const article = RF(articlePath) || {};
    const comments = RF(commentPath) || {};
    comments.views = comments.views + 1;
    await ctx.render("detail", {
      viewTitle: article.title,
      topImg: article.face_img,
      authorInfo: { name: article.author, date: formatTime(article.ct, '-') },
      label: article.label,
      descriptionBox: article.html,
      commentInfoList: comments.comments || [],
      flover: comments.flover,
      views: comments.views
    });
    WF(commentPath, comments)
  });

  // 渲染关于我们页
  router.get(api.about, async (ctx) => {
    await ctx.render("about", {
      aboutus: '关于我们',
      aboutDesc: 'simpleCMS 简介',
      teamDesc: '团队介绍',
      teams: [
        {
          tx: '头像',
          name: '徐小夕',
          job: '前端工程师',
          desc: '简短介绍',
          github: 'github.com/xuxiaoxi',
        },
        {
          tx: '头像',
          name: '陈伟',
          job: '前端工程师',
          desc: '简短介绍',
          github: 'github.com/chenwei',
        },
        {
          tx: '头像',
          name: '苗晨浩',
          job: 'UI设计师',
          desc: '简短介绍',
          github: 'github.com/mch',
        },
        {
          tx: '头像',
          name: '胡国江',
          job: '前端工程师',
          desc: '简短介绍',
          github: 'github.com/hgj',
        },
      ],
      copyright: '版权所有 @SimpleCMS 研发团队',
    });
  });

  // 渲染分类页
  router.get(api.cates, async (ctx) => {
    const filePath = `${config.publicPath}/db/ads.json`;
    const articleIdxPath = `${config.publicPath}/db/article_index.json`
    const ads = RF(filePath);
    let articleIdxs = RF(articleIdxPath);
    articleIdxs = articleIdxs.map(item => {
      let date = new Date(item.ct);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      return {
        ...item,
        ct: `${y}/${m}/${d}`
      }
    })
    const topArticles = articleIdxs.filter(item => !!item.top);
    console.log({
      ads,
      tops: topArticles,
      list: articleIdxs
    })
    await ctx.render("index", {
      ads,
      tops: topArticles,
      list: articleIdxs
    });
  });
};

export default pageRenderRouter;
