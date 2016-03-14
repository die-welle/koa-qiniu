koa-qiniu
=========================

koa qiniu middleware


## Requirement

- Multipart body parser (eg: [koa-body](https://github.com/dlau/koa-body))
- Qiniu developer account


## Quick Start

```js
import koa from 'koa';
import qiniu from 'koa-qiniu';
import koaBody from 'koa-body';

const port = process.env.PORT || 3000;
const app = koa();

app.use(koaBody({
    formLimit: '20mb',
    jsonLimit: '20mb',
    multipart: true,
    formidable: { uploadDir: './tmp' },
}));

app.use(qiniu({
    accessKey: '<YOUR_ACCESS_KEY>', // [required] qiniu accessKey

    secretKey: '<YOUR_SECRET_KEY>', // [required] qiniu secretKey

    baseURL: 'http://<YOUR_QINIU_BASE_URL>.clouddn.com/', // [required] qiniu basURL

    bucket: 'my_bucket', // [optional]: qiniu bucket

    fileUploadPathName: '/upload', // [optional]: upload file pathname, eg: http://imyourfather.com/upload

    fileFormName: 'file', // [optional]

    base64UploadPathName: '/upload/base64', // upload base64 pathname, eg: http://imyourfather.com/upload/base64

    base64FormName: 'base64', // [optional]

    filesBodyParser: (ctx) => { // [optional]

        // this is default, for `koa-body` middleware.
        return ctx.request.body.files;

        // if you are using `koa-bodyparser` middleware,
        // you should use `ctx.req.files;` instead.
    },

    onError: (err, ctx) => {
        console.error(err);
        ctx.body = 'error';
    },
}));

app.listen(port);

```


## Example

    $ git clone <this_git_repo>
    $ npm i
    $ npm start

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install koa-qiniu --save


## License

MIT
