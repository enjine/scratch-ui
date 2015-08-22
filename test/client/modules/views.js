/*eslint no-unused-expressions: 0*/
import {BaseView} from '../../../lib/client/modules/views';

import {settings} from '../../setup';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {inherits} from '../../../lib/client/modules/util';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

describe('Views::Generic', () => {
	let testView = function(el, options){

		},
		v;

	inherits(testView, BaseView);

	before(()=> {
		v = new testView(document.createElement('figure'), {swerve: true});
	});

	it('Is a descendant of BaseView', () => {
		expect(v).to.be.an.instanceof(BaseView);
		expect(v).to.be.an.instanceof(testView);
	});

	xit('Handles constructor arguments appropriately', () => {});

});
