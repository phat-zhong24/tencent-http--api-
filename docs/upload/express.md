## 文件上传说明

项目中如果涉及到文件上传，需要依赖 API 网关提供的 [Base64 编码能力](https://cloud.tencent.com/document/product/628/51799)，使用时只需要 `serverless.yml` 中配置 `isBase64Encoded` 为 `true`，如下：

```yaml
component: http
name: expressDemo

inputs:
  # 省略...
  apigw:
    isBase64Encoded: true
    # 省略...
  # 省略...
```

当前 API 网关支持上传最大文件大小为 `2M`，如果文件过大，请修改为前端直传对象存储方案。

## Base64 示例

入口文件 `sls.js` 如下:

```js
const multer = require('multer');
const express = require('express');
const path = require('path');

const app = express();
const isServerless = process.env.SERVERLESS;
const upload = multer({ dest: isServerless ? '/tmp/upload' : './upload' });

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({
    success: true,
    data: req.file,
  });
});
// ...

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});
```

实例代码实现了文件上传接口 `POST /upload`，如果要支持文件上传，需要安装 `multer` 包。

同时需要在 `serverless.yml` 的 `apigatewayConf` 中配置 `isBase64Encoded` 为 `true`。
