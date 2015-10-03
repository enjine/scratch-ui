import Model from './Model';

export default class Product extends Model {
	setInitialProps () {
		this.defaults = {};
		Model.prototype.setInitialProps.apply(this, arguments);
	}
}

export {Product as ProductModel};

