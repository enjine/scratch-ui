var express = require('express');
var path = require('path');
var https = require('https');
var pem = require('pem');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var rp = require('request-promise');
var errors = require('request-promise/errors');


// e750 modules
var routeFilters = require('./filters');


var app;
var port = process.env.PORT || 8080;        // set our port
var sslPort = 4430;        // set our secure port
var staticPath = path.resolve(__dirname, '../../acme-vineyards-webflow'); // static files

//support https
pem.createCertificate({days: 1, selfSigned: true}, function (err, keys) {
	app = express({key: keys.serviceKey, cert: keys.certificate});
	https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(sslPort);

// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
		extended: false
	}));
// parse application/json
	app.use(bodyParser.json());
	app.use(cookieParser());

// ROUTERS

	let apiRouter = express.Router();
	let appRouter = express.Router();

// ROUTE FILTERS/MIDDLEWARE -------------------------------
	/**
	 * global route prefilter, runs on every request
	 *
	 * Checks for APIKEY, if not present, fetches from key server
	 * and sets cookie.
	 *
	 */
	app.use('/', routeFilters.cookie);

// END ROUTE FILTERS/MIDDLEWARE -------------------------------


// API ROUTES -------------------------------

	/**
	 * all routes relative to router mount point
	 * 	=> http://localhost:8080/{mount_point} (/api)
	 */
	apiRouter.route('/products')
		.get((req, res) => {
			function render (result){
				res.setHeader('Content-Type', 'application/json');
				//res.writeHead(200)
				res.send(result);
				res.end();
			}

			let host = 'api.securecheckout.com',
				url = '/v1/cart/products/',
				options = {
						hostname: host,
						uri: 'https://' + host + url,
						method: 'GET',
						headers: {
							'X-Auth-Token': req.cookies.apikey
						},
						resolveWithFullResponse: true
					};


				console.log(':: requesting products', req.cookies, options);
				rp(options).then((r) => {
					if (r.statusCode === 200 && r.body) {
						// success
						//console.log("GOT: ", r.statusCode, r.body);
						render(r.body);
					} else {
						//fail
						render(r.body);
					}
				}).catch(errors.RequestError, (reason) =>{
					console.log('FAILED: RequestError -> ');
					render(reason.body);
				}).catch(errors.StatusCodeError, (reason) => {
					console.log('FAILED: StatusCodeError -> ');
					render(reason.body);
				});
		});

	apiRouter.route('/token')
		.get((req, res) => {
			console.log('processing GET');
			res.end();
		})
		.post((req, res) =>{
			console.log('processing POST');
			res.end();
		})
		.put((req, res) => {
			console.log('processing PUT');
			res.end();
		});

// API index route
	apiRouter.route('/')
		.get((req, res) =>{
			console.log('this is the api:', req.route);
			res.json({message: 'e750 REST API ready.'});
			res.end();
		});

// END API ROUTES -------------------------------


// APP ROUTES -------------------------------
	appRouter.route('/ham')
		.get((req, res) =>{
			res.setHeader('Content-Type', 'text/html');
			res.send('<h1>Ham you say? Sure. Why not?</h1>');
			res.end();
		});

// ENDAPP ROUTES -------------------------------

// mount the API router at /api
	app.use('/api', apiRouter);

// mount a regular router at /
	app.use('/', appRouter);

// static routes always last
	app.use(express.static(staticPath));


// plain 'ol http
	app.listen(port);

	console.log('HTTP(S) servers on ports: ' + port + ' / ' + sslPort);
	console.log('Static files root: ' + staticPath);

	console.log('registered API routes:');
	apiRouter.stack.forEach((r) => {
		if (r.route && r.route.path) {
			console.log(r.route.path);
		}
	});

	console.log('registered APP routes:');
	appRouter.stack.forEach((r) => {
		if (r.route && r.route.path) {
			console.log(r.route.path);
		}
	});
});


