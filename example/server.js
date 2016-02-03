
import koa from 'koa';
import koaBody from 'koa-body';
import qiniu from '../src';
import outputHost from 'output-host';
import mkdirp from 'mkdirp';

const port = process.env.PORT || 3000;
const app = koa();

{
	const uploadDir = './tmp';
	mkdirp.sync(uploadDir);

	app.use(koaBody({
		formLimit: '20mb',
		jsonLimit: '20mb',
		multipart: true,
		formidable: { uploadDir },
	}));
}

{
	let qiniuConfig = {};
	const configFile = 'config.json';

	try {
		qiniuConfig = require(`./${configFile}`);
	}
	catch (err) {
		const configFileExample = {
			accessKey: '<YOUR_ACCESS_KEY>',
			secretKey: '<YOUR_SECRET_KEY>',
			baseURL: 'http://<YOUR_QINIU_BASE_URL>.clouddn.com/',
			bucket: '<YOUR_BUCKET>'
		};

		console.error(
			`你需要先在 \`${__dirname}\` 目录创建 \`${configFile}\` 文件，格式如下：`
		);

		console.error(JSON.stringify(configFileExample, null, 2));

		process.exit(1);
	}

	app.use(qiniu({
		...qiniuConfig,
		onError: (err, ctx) => {
			console.error(err);
			ctx.body = 'error';
		},
	}));
}

app.listen(port, () => outputHost({
	port,
	useCopy: false,
}));
