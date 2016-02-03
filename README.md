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
    accessKey: '<YOUR_ACCESS_KEY>', // required

    secretKey: '<YOUR_SECRET_KEY>', // required

    baseURL: 'http://<YOUR_QINIU_BASE_URL>.clouddn.com/', // required

    bucket: '<YOUR_BUCKET>', // default: 'my_bucket'

    fileFormName, // default: 'file'

    base64FormName, // default: 'base64'

    fileUploadPathName, // default: '/upload'

    base64UploadPathName, // default: '/upload/base64'

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
