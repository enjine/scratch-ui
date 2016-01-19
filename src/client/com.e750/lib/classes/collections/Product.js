import Collection from './Collection';
import Product from '../../classes/models/Product';

export default class ProductCollection extends Collection {
    initProps (models = [], options = {}) {
        super.initProps(models, options);
        this.model = (options.model) ? options.model : Product;
    }
}
