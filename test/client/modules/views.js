/*eslint no-unused-expressions: 0*/
import {BaseView} from '../../../lib/client/modules/views';

import {settings} from '../../setup';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {inherits} from '../../../lib/client/modules/util';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

describe('Views::Generic', () => {
	let testView = function () {
			BaseView.apply(this, arguments);
		};

	inherits(testView, BaseView);

	let v = new testView(document.createElement('figure'), {swerve: true});

	before(()=> {});

	it('Is a descendant of BaseView', () => {
		expect(v).to.be.an.instanceof(BaseView);
		expect(v).to.be.an.instanceof(testView);
	});

	xit('Handles constructor arguments appropriately', () => {
		console.log(v, v.el);
		expect(v.swerve).to.exist;
		expect(v.el).to.exist;

	});

	describe(EmitterMixinBehavior.describe(), EmitterMixinBehavior.test.bind(this, v));

});
