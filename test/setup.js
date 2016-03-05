let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
import sinon from 'sinon/pkg/sinon.js';


export let settings = {
	init: function () {
		mocha.setup('bdd');
		chai.use(chaiAsPromised);
	},
	assertions: chai,
	mocking: sinon
};
