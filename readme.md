# @kuankuan/static-file-server-components

@kuankuan/static-file-server-components is a component for a static file server, which allows you to easily build a Node.js-based static file server.

## Installation

Use npm to install:

```shell
npm install @kuankuan/static-file-server-components
```

## Usage

```javascript
import staticFileServerComponent from "@kuankuan/static-file-server-components";

const config = {
    urlPrefix: "/static",
    rootDir: "/path/to/root",
    // Optional configurations
    dirDefaultEntries: ["index.html"],
    mimeTypes: {
        ".html": "text/html",
        ".css": "text/css",
        // ...
    },
    onNotFound: async function (component, req, res, target) {
        // Handle file not found
    },
    onDir: async function (component, req, res, target) {
        // Handle directory access
    },
    onFile: async function (component, req, res, target) {
        // Handle file access
    },
    onError: async function (component, req, res, target, err) {
        // Handle errors
    },
    on404: async function (component, req, res, target) {
        // Handle 404 errors
    },
    on403: async function (component, req, res, target) {
        // Handle 403 errors
    },
    on500: async function (component, req, res, target, err) {
        // Handle 500 errors
    }
};

const server = new staticFileServerComponent(config);

// Handle requests
server.onRequest(req, res);
```

## Configuration Options

- `urlPrefix`: URL prefix used to match static file requests.
- `rootDir`: Root directory of static files.
- `dirDefaultEntries`: Default directory index file list, default is `["index.html"]`.
- `mimeTypes`: Mapping table of file extensions to MIME types, using the built-in MIME type table by default.
- `onNotFound`: Handler function for file not found.
- `onDir`: Handler function for directory access.
- `onFile`: Handler function for file access.
- `onError`: Error handler function.
- `on404`: Handler function for 404 errors.
- `on403`: Handler function for 403 errors.
- `on500`: Handler function for 500 errors.

## Open Source Information

This project is open source under the MulanPSL-2.0 license. For more details, see [LICENSE](./LICENSE).

[Gitee](https://gitee.com/kuankuan2007/static-file-server-components)|[GitHub](https://github.com/kuankuan2007/static-file-server-components)|[GitLab](https://gitlab.com/kuankuan2007/static-file-server-components)

