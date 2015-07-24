var test = require('tape');
import {BaseCollection, ProductCollection} from '../../../acme-vineyards-webflow/js/modules/collections';

test('Inherits from BaseCollection', (t) => {
	t.plan(1);

	let pc = new ProductCollection();
	t.equals(Object.getPrototypeOf(pc), BaseCollection);

});
