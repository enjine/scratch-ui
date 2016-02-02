import Model from './Model';

export default class Product extends Model {
    initProps () {
        this.defaults = {};
        Model.prototype.initProps.apply(this, arguments);
        return this;
    }
}

export {Product as ProductModel};

