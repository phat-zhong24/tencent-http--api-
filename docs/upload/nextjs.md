## 文件上传说明

项目中如果涉及到文件上传，需要依赖 API 网关提供的 [Base64 编码能力](https://cloud.tencent.com/document/product/628/51799)，使用时只需要 `serverless.yml` 中配置 `isBase64Encoded` 为 `true`，如下：

```yaml
component: http
name: nextjsDemo

inputs:
  # 省略...
  apigw:
    isBase64Encoded: true
    # 省略...
  # 省略...
```

当前 API 网关支持上传最大文件大小为 `2M`，如果文件过大，请修改为前端直传对象存储方案。

## Base64 示例

自定义服务为 Express:

```js
const multer = require('multer');
const express = require('express');
const next = require('next');

const isServerless = process.env.SERVERLESS;

async function createServer() {
  const upload = multer({ dest: isServerless ? '/tmp/upload' : './upload' });

  const server = express();
  const app = next({ dev: false });
  const handle = app.getRequestHandler();

  server.post('/upload', upload.single('file'), (req, res) => {
    res.send({
      success: true,
      data: req.file,
    });
  });

  server.all('*', (req, res, next) => {
    return handle(req, res);
  });

  // define binary type for response
  // if includes, will return base64 encoded, very useful for images
  server.binaryTypes = ['*/*'];

  return server;
}

module.exports = createServer;

createServer().then((server) => {
  server.listen(9000, () => {
    console.log(`Server start on http://localhost:9000`);
  });
});
```

自定义服务为 Koa：

```js
const Koa = require('koa');
const Router = require('@koa/router');
const multer = require('@koa/multer');
const next = require('next');

const isServerless = process.env.SERVERLESS;

async function createServer() {
  const server = new Koa();
  const router = new Router();
  const upload = multer({ dest: isServerless ? '/tmp/upload' : './upload' });
  const app = next({ dev: false });
  const handle = app.getRequestHandler();

  router.post('/upload', upload.single('file'), (ctx) => {
    ctx.body = {
      success: true,
      data: ctx.file,
    };
  });

  server.use(router.routes()).use(router.allowedMethods());

  server.use((ctx) => {
    ctx.status = 200;
    ctx.respond = false;
    ctx.req.ctx = ctx;

    return handle(ctx.req, ctx.res);
  });

  // define binary type for response
  // if includes, will return base64 encoded, very useful for images
  server.binaryTypes = ['*/*'];

  return server;
}

createServer().then((server) => {
  server.listen(9000, () => {
    console.log(`Server start on http://localhost:9000`);
  });
});
```

开发者可根据个人项目需要参考修改，使用时需要将使用的自定服务的示例复制为 `sls.js` 文件。

上述代码中实现了文件上传接口 `POST /upload`。使用 Koa 的项目，如果要支持文件上传，需要安装 `@koajs/multer` 和 `multer` 包。使用 Express 的项目，如果要支持文件上传，需要安装 `multer` 包。

同时需要在 `serverless.yml` 的 `apigw` 中配置 `isBase64Encoded` 为 `true`。
