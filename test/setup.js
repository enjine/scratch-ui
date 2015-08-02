let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');


export let settings = {
	init: function () {
		mocha.setup('bdd');
		chai.use(chaiAsPromised);
	},
	assertions: chai.expect,
	mocking: require('sinon')
};
