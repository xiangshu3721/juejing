# 觉镜 JueLens

AI 个案复盘与专业成长助手。用户只访问本站，由服务器用 DeepSeek 生成报告。Key 不进浏览器。

## 本地

```bash
cp .env.example .env.local
# 填写 DEEPSEEK_API_KEY
npm install
npm run dev
```

打开 http://localhost:3002 。`.env.local` 不会进 Git。

## 上线：共用一把 DeepSeek Key

线上所有人走同一把服务端 Key。在托管平台配置（不要加 `NEXT_PUBLIC_`）：

- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL=https://api.deepseek.com/v1`
- `DEEPSEEK_MODEL=deepseek-chat`
- `REVIEW_RATE_LIMIT_PER_HOUR=8`

流程：用户提交会谈文字或 TXT/DOCX/PDF → 服务器请求 DeepSeek → 返回报告。个案内容只存在用户自己的浏览器里。

## 国内访问怎么选托管

没有 ICP 备案时，不要把站点放在内地机房。Vercel / Netlify 美西节点国内经常打不开。

推荐：把仓库接到 [Zeabur](https://zeabur.com)，**地区选香港**。国内可访问，服务器也能直连 `api.deepseek.com`。

也可以用 Docker 部署到腾讯云 / 阿里云的**香港轻量**：

```bash
docker build -t juelens .
docker run -p 3000:3000 \
  -e DEEPSEEK_API_KEY=你的密钥 \
  -e DEEPSEEK_BASE_URL=https://api.deepseek.com/v1 \
  -e DEEPSEEK_MODEL=deepseek-chat \
  juelens
```
