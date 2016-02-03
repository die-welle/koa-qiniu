
import Router from 'koa-router';
import qiniu from 'qiniu';
import fetch from 'node-fetch';
import fs from 'fs';
import invariant from 'invariant';
import { name as packageName } from '../package.json';

const router = new Router();
const BASE64_URL = 'http://up.qiniu.com/putb64/-1';
const noop = () => {};

const removeFiles = (files) => Object
	.keys(files)
	.forEach((name) => {
		[].concat(files[name]).forEach((f) => fs.unlink(f.path, noop));
	})
;

const throwError = (missingParamName) => {
	throw new Error(`[${packageName}] missing param \`${missingParamName}\`.`);
};

const uploadBase64 = (token, file) => fetch(BASE64_URL, {
	method: 'POST',
	headers: {
		Authorization: `UpToken ${token}`,
	},
	body: file.split(',')[1],
})
.then((res) => res.json());

const uploadFile = (token, file) => new Promise((resolve, reject) => {
	const extra = new qiniu.io.PutExtra();
	qiniu.io.putFile(token, null, file, extra, (err, res) => {
		if (!err) { resolve(res); }
		else { reject(err); }
	});
});

export default (config) => {
	const {
		accessKey,
		secretKey,
		baseURL,
		bucket = 'my_bucket',
		fileFormName = 'file',
		base64FormName = 'base64',
		fileUploadPathName = '/upload',
		base64UploadPathName = '/upload/base64',
		onError = noop,
	} = config;

	['accessKey', 'secretKey', 'baseURL'].forEach((p) => {
		invariant(config[p], `[${packageName}] missing param: ${p}`);
	});

	const getUptoken = () => {
		const putPolicy = new qiniu.rs.PutPolicy(bucket);
		return putPolicy.token();
	};

	const response = (ctx, file, upload) =>
		upload(getUptoken(), file).then(({ key }) =>
			ctx.body = { url: baseURL + key }
		)
	;

	qiniu.conf.ACCESS_KEY = accessKey;
	qiniu.conf.SECRET_KEY = secretKey;

	router.post(fileUploadPathName, function * () {
		try {
			const { files } = this.request.body;
			const file = [].concat(files[fileFormName])[0];
			if (file) {
				yield response(this, file.path, uploadFile);
				removeFiles(files);
			}
			else {
				throwError(fileFormName);
			}
		}
		catch (error) {
			removeFiles(this.request.body.files);
			onError.call(this, error, this);
		}
	});

	router.post(base64UploadPathName, function * () {
		try {
			const base64 = this.request.body[base64FormName];
			if (base64) {
				yield response(this, base64, uploadBase64);
			}
			else {
				throwError(base64FormName);
			}
		}
		catch (error) {
			onError.call(this, error, this);
		}
	});

	return router.middleware();
};
