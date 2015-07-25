var rp = require('request-promise');

module.exports = {

	cookie: (req, res, next) => {
		function setCookie (response, name, data) {
			console.log(':: setting cookie: ' + name + '=' + data);
			response.cookie(name, data, {secure: true, maxAge: 36000, httpOnly: false});
			console.log('== cookies: ', response.cookies);
			console.log('== cookies: ', req.cookies);
		}

		let requestedFileType = (req.url.indexOf('.') !== -1) ? req.url.split('.').pop().toLowerCase() : 'html';
		let numCookies = Object.keys(req.cookies).length;
		console.log('incoming: ', req.method, req.url.indexOf('.'), requestedFileType, req.url, req.path);
		if (requestedFileType === 'html' || req.url === '/') {

			console.log(' -> prefiltering: ', req.method, req.url);

			//res.clearCookie('apikey');

			console.log(' 	-> cookies (' + numCookies + '): ', req.cookies);
			if (numCookies === 0 || !req.cookies.apikey) {
				console.log('no token!');
				// request a token
				var user = 'acmev',
					secret = '18Minutes',
					host = 'auth.securecheckout.com',
					url = '/v0.1/apiGateway/getToken/',
					options = {
						hostname: host,
						uri: 'https://' + host + url,
						method: 'GET',
						headers: {
							'X-Auth-User': user,
							'X-Auth-Key': secret
						},
						resolveWithFullResponse: true
					};


				console.log(':: requesting token', options);
				rp(options).then((r) => {
					if (r.statusCode === 200 && r.body) {
						console.log('GOT: ', r.statusCode, r.body);
						setCookie(res, 'apikey', JSON.parse(r.body));
						next();
					}
				}).catch((reason) => {
					console.error(reason);
					next();
				});
			} else {
				console.log(':: cookie is there ::', req.cookies.apikey);
				next();
			}
		} else {
			console.log(' -> passthru: ', req.method, req.url);
			next();
		}

	},

	auth: () => {

	}
};
