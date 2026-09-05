# 觉镜 JueLens

别人打开的是 GitHub Pages 页面。DeepSeek 仍由腾讯云上的接口调用，Key 不进浏览器。

**给别人用的地址：** https://xiangshu3721.github.io/juejing/

## 本地

```bash
cp .env.example .env.local
# 填写 DEEPSEEK_API_KEY
npm install
npm run dev
```

打开 http://localhost:3002

## 线上怎么分工

| 部分 | 放哪 | 别人看到什么 |
|---|---|---|
| 页面 | GitHub Pages | `https://xiangshu3721.github.io/juejing/` |
| 复盘接口 | 已有的腾讯云云托管 | 浏览器后台请求，没有风险提醒页 |

推送到 `main` 后，GitHub Actions 会自动更新 Pages。接口继续用已经配好 DeepSeek 的云托管。**改过接口的 CORS 之后，需要在云托管再发布一版**，否则 GitHub 页面调接口会被浏览器拦住。

云托管地址：

`https://juelens-308371-7-1304965105.sh.run.tcloudbase.com/api/review`
