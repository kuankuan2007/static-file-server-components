# @kuankuan/static-file-server-components

@kuankuan/static-file-server-components 是一个用于静态文件服务器的组件，可以轻松地搭建一个基于 Node.js 的静态文件服务器。

## 安装

使用 npm 进行安装：

```shell
npm install @kuankuan/static-file-server-components
```

## 使用

```javascript
import staticFileServerComponent from "@kuankuan/static-file-server-components";

const config = {
    urlPrefix: "/static",
    rootDir: "/path/to/root",
    // 可选配置项
    dirDefaultEntries: ["index.html"],
    mimeTypes: {
        ".html": "text/html",
        ".css": "text/css",
        // ...
    },
    onNotFound: async function (component, req, res, target) {
        // 处理文件未找到的情况
    },
    onDir: async function (component, req, res, target) {
        // 处理目录访问的情况
    },
    onFile: async function (component, req, res, target) {
        // 处理文件访问的情况
    },
    onError: async function (component, req, res, target, err) {
        // 处理错误的情况
    },
    on404: async function (component, req, res, target) {
        // 处理 404 错误的情况
    },
    on403: async function (component, req, res, target) {
        // 处理 403 错误的情况
    },
    on500: async function (component, req, res, target, err) {
        // 处理 500 错误的情况
    }
};

const server = new staticFileServerComponent(config);

// 处理请求
server.onRequest(req, res);
```

## 配置项

- `urlPrefix`：URL 前缀，用于匹配静态文件请求。
- `rootDir`：静态文件根目录。
- `dirDefaultEntries`：默认目录入口文件列表，默认为 `["index.html"]`。
- `mimeTypes`：文件扩展名与 MIME 类型的映射表，默认使用内置的 MIME 类型表。
- `onNotFound`：文件未找到时的处理函数。
- `onDir`：目录访问时的处理函数。
- `onFile`：文件访问时的处理函数。
- `onError`：错误处理函数。
- `on404`：处理 404 错误的函数。
- `on403`：处理 403 错误的函数。
- `on500`：处理 500 错误的函数。

## 开源信息

本项目使用MulanPSL-2.0协议开源，详情参见[LICENSE](./LICENSE)

[Gitee](https://gitee.com/kuankuan2007/static-file-server-components)|[GitHub](https://github.com/kuankuan2007/static-file-server-components)|[GitLab](https://gitlab.com/kuankuan2007/static-file-server-components)
