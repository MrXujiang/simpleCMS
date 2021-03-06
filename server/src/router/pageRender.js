import { WF, RF } from "../lib/upload";
import config from "../config";
import marked from "../lib/marked";

const formatTime = (timeStemp, flag = "/") => {
  let date = new Date(timeStemp);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  return `${y}${flag}${m}${flag}${d}`;
};
/**
 * 文章路由
 * @param {*} router
 * @param {*} apiPath
 * 待优化：1.将成功响应和失败响应统一封装
 */
const pageRenderRouter = (router) => {
  // api路径
  const api = {
    index: "/",
    login: "/login",
    registered: "/registered",
    home: "/home",
    detail: "/detail",
    cates: "/cates",
    about: "/about",
  };

  // 首页
  router.get(api.index, async (ctx) => {
    await ctx.render("home", {
      isHome: true,
      homeTitle: "趣写, 让写作更有趣",
      copyright: "版权所有 @SimpleCMS 研发团队",
      homeContent:
        "simpleCMS是一款开源cms系统, 主要为个人/团队快速开发博客或者知识共享平台, 类似于hexo, worldpress, 但是他们往往需要复杂的搭建过程, 我们将复杂度降到最低, 并且有详细的部署教程, 你只需要有一台服务器, 就能轻松拥有一个属于你的博客平台.",
    });
  });

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
    const settingPath = `${config.publicPath}/db/setting.json`;
    let setting = RF(settingPath) || {};
    const filePath = `${config.publicPath}/db/ads.json`;
    const articleIdxPath = `${config.publicPath}/db/article_index.json`;
    const ads = RF(filePath) || {};
    let articleIdxs = RF(articleIdxPath) || [];
    // 搜索功能
    if (articleIdxs.length && ctx.query.keyword) {
      let keyword = decodeURI(ctx.query.keyword);
      articleIdxs = articleIdxs.filter(
        (item) =>
          item.title.indexOf(keyword) > -1 ||
          (item.desc && item.desc.indexOf(keyword)) > -1
      );
    }
    articleIdxs = articleIdxs.map((item) => {
      const commentPath = `${config.publicPath}/db/comments/${item.fid}.json`;
      const articlePath = `${config.publicPath}/db/articles/${item.fid}.json`;
      const comments = RF(commentPath) || {};
      const article = RF(articlePath) || {};
      item.name = article.author;
      item.date = formatTime(article.ct, "-");
      item.flover = comments.flover;
      item.label = item.label.join("/");
      return {
        ...item,
        ct: formatTime(item.ct),
      };
    });
    const topArticles = articleIdxs.filter((item) => !!item.top);
    await ctx.render("index", {
      theme: setting.website.theme,
      ads,
      tops: topArticles,
      list: articleIdxs,
      copyright: "版权所有 @SimpleCMS 研发团队",
    });
  });

  // 渲染详情页
  router.get(api.detail, async (ctx) => {
    const settingPath = `${config.publicPath}/db/setting.json`;
    let setting = RF(settingPath) || {};
    const id = ctx.query.fid;
    const articlePath = `${config.publicPath}/db/articles/${id}.json`;
    const commentPath = `${config.publicPath}/db/comments/${id}.json`;
    const adsPath = `${config.publicPath}/db/ads.json`;
    const article = RF(articlePath) || {};
    const comments = RF(commentPath) || {};
    const ads = RF(adsPath) || {};
    comments.views = comments.views + 1;
    await ctx.render("detail", {
      theme: setting.website.theme,
      viewTitle: article.title,
      topImg: article.face_img,
      authorInfo: { name: article.author, date: formatTime(article.ct, "-") },
      label: article.label,
      editor: article.type ? marked(article.html) : article.content,
      payCode: article.payCode,
      commentInfoList: comments.comments || [],
      flover: comments.flover,
      views: comments.views || 0,
      ads: ads.sideAd || {},
      copyright: "版权所有 @SimpleCMS 研发团队",
    });
    WF(commentPath, comments);
  });

  // 渲染关于我们页
  router.get(api.about, async (ctx) => {
    const settingPath = `${config.publicPath}/db/setting.json`;
    let setting = RF(settingPath) || {};
    // 头像
    await ctx.render("about", {
      theme: setting.website.theme,
      introductionInfo:
        "simpleCMS是一款开源cms系统, 主要为个人/团队快速开发博客或者知识共享平台, 类似于hexo, worldpress, 但是他们往往需要复杂的搭建过程, 我们将复杂度降到最低, 并且有详细的部署教程, 你只需要有一台服务器, 就能轻松拥有一个属于你的博客平台.",
      teams: [
        {
          avatarUrl: "xujiang",
          name: "徐小夕",
          job: "FRONT-END ENGINEER",
          desc: "专注于前端工程化, 可视化方向的研究~",
          github: "https://github.com/MrXujiang",
        },
        {
          avatarUrl: "huguojiang",
          name: "胡小磊",
          job: "FRONT-END ENGINEER",
          desc: "不好好写代码就要回家继承家产了, 好烦~",
          github: "https://github.com/huguojiang",
        },
        {
          avatarUrl: "chenwei",
          name: "The Way",
          job: "FRONT-END ENGINEER",
          desc: "越努力, 越幸运~",
          github: "https://github.com/cw514102209",
        },
        {
          avatarUrl: "miaochenhao",
          name: "Duang",
          job: "DESIGNER",
          desc: "准备回老家养猪的设计师~",
          github: "",
        },
      ],
      copyright: "版权所有 @SimpleCMS 研发团队",
    });
  });

  // 渲染分类页
  router.get(api.cates, async (ctx) => {
    const settingPath = `${config.publicPath}/db/setting.json`;
    let setting = RF(settingPath) || {};
    const articleIdxPath = `${config.publicPath}/db/article_index.json`;
    let articleIdxs = RF(articleIdxPath);
    let resultRush = [];
    if (articleIdxs && articleIdxs.length) {
      let result = [];
      articleIdxs.forEach((item) => {
        result = result.concat(item.label);
      });
      // 计数
      let resultObj = {};
      result.forEach((item) => {
        resultObj[item] = resultObj[item] ? resultObj[item] + 1 : 1;
      });

      // 生成随机颜色
      const generateRandomColor = () => {
        return (
          "#" +
          ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
        );
      };

      // 数据清洗
      for (let [key, value] of Object.entries(resultObj)) {
        resultRush.push({ k: key, n: value, c: generateRandomColor() });
      }
    }

    await ctx.render("cates", {
      theme: setting.website.theme,
      labels: resultRush,
      copyright: "版权所有 @SimpleCMS 研发团队",
    });
  });
};

export default pageRenderRouter;
