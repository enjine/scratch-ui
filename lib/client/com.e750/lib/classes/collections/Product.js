import Collection from './Collection';
import Product from '../../classes/models/Product';

console.log('prodcoll', Collection);

export default class ProductCollection extends Collection {
	constructor (options) {
		super(arguments);
		this.model = (options && options.model) ? options.model : Product;
	}
}

ProductCollection.foo = true;
