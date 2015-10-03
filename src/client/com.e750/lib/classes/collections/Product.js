import Collection from './Collection';
import Product from '../../classes/models/Product';

export default class ProductCollection extends Collection {
	setInitialProps (models = [], options = {}) {
		super.setInitialProps(models, options);
		this.model = (options.model) ? options.model : Product;
	}
}
