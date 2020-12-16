import fs, { readFile } from "fs";
import { delFile, WF, RF } from "../lib/upload";
import { uuid } from "../lib/tool";
import { auth } from "../service";
import config from "../config";
import htr from "../lib/htr";
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
      url: "/login",
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
      url: "/registered",
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
    await ctx.render("index", {
      contentShow: {
        title: "文章标题文章标题文章标题文章标题",
        introduce:
          "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容容内容内容内容内容内容",
        date: "2020-11-14",
        author: "Huxiaolei",
      },
      colunmList: [
        { title: "标题", introduction: "描述描述描述描述描述描述描述描述" },
        { title: "标题", introduction: "描述描述描述描述描述描述描述描述" },
        { title: "标题", introduction: "描述描述描述描述描述描述描述描述" },
      ],
      updataList: [
        {
          img: "/assets/child.png",
          title: "标题",
          introduction: "描述描述描述描述描述描述描述描述",
          avatarName: "huxiaolei",
          date: "11/14",
        },
        {
          img: "/assets/child.png",
          title: "标题",
          introduction: "描述描述描述描述描述描述描述描述",
          avatarName: "huxiaolei",
          date: "11/14",
        },
        {
          img: "/assets/child.png",
          title: "标题",
          introduction: "描述描述描述描述描述描述描述描述",
          avatarName: "huxiaolei",
          date: "11/14",
        },
      ],
    });
  });

  // 渲染详情页
  router.get(api.detail, async (ctx) => {
    await ctx.render("detail", {
      viewTitle: "文章标题文章标题文章标题文章标题",
      authorInfo: { name: "huxialei", date: "2020-11-15" },
      descriptionBox: [
        "“服务设计”真正让所有人重视“用户”、重视“体验”这件事情，通过“服务设计”打通所有的节点（现在我们叫触点），把所有人调动起来。所以我认为，服务设计仅仅在“文化驱动”这个层面都是非常有价值的。 对于公司来说，“服务设计”是一个能够让公司所有的人都去接触客户，并且开始思考好的体验是什么样的一种理念。",
        "“体验设计”可以让你走好，“服务设计”可以让你走远。",
        "互联网常用的敏捷开发，核心是快。“我”要侧重做哪一个需求？“我”是先做哪个，或是后做哪一个才能保证快起来？“我”要去把需求管理起来，所以敏捷的“快”不是快，而是在于精准的需求管理与控制能力。",
        "不管是服务设计师也好，交互设计师也好，或者叫全链路设计师也好，他一定会参与到战略层里面去的。 一定是一个有经验的一个人，懂产品，也懂设计，也懂研究的这种人。",
        "如果“你”想把自己变成一个“T”型人才，或者是“π”型人才，你总要有一项能力是纵深的。",
        "先扩大自己的现有优势",
      ],
      commentInfoList: [
        {
          name: "huxialei",
          date: "2020-11-15",
          content: "所以敏捷的“快”不是快，而是在于精准的需求管理与控制能力。",
        },
        {
          name: "huxialei",
          date: "2020-11-15",
          content: "所以敏捷的“快”不是快，而是在于精准的需求管理与控制能力。",
        },
        {
          name: "huxialei",
          date: "2020-11-15",
          content: "所以敏捷的“快”不是快，而是在于精准的需求管理与控制能力。",
        },
      ],
    });
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
    await ctx.render("index", {
      contentShow: {
        title: "文章标题文章标题文章标题文章标题",
        introduce:
          "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容容内容内容内容内容内容",
        date: "2020-11-14",
        author: "Huxiaolei",
      },
      colunmList: [
        { title: "标题", introduction: "描述描述描述描述描述描述描述描述" },
        { title: "标题", introduction: "描述描述描述描述描述描述描述描述" },
        { title: "标题", introduction: "描述描述描述描述描述描述描述描述" },
      ],
      updataList: [
        {
          img: "/assets/child.png",
          title: "标题",
          introduction: "描述描述描述描述描述描述描述描述",
          avatarName: "huxiaolei",
          date: "11/14",
        },
        {
          img: "/assets/child.png",
          title: "标题",
          introduction: "描述描述描述描述描述描述描述描述",
          avatarName: "huxiaolei",
          date: "11/14",
        },
        {
          img: "/assets/child.png",
          title: "标题",
          introduction: "描述描述描述描述描述描述描述描述",
          avatarName: "huxiaolei",
          date: "11/14",
        },
      ],
    });
  });
};

export default pageRenderRouter;
