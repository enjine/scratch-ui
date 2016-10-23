import {jst} from 'lib/core';
import {ProductModel} from 'lib/classes/models/Product';
import Component from 'lib/components/Component';


export default class Product extends Component {


    constructor (el, options = {}){
        Object.assign(options, {
            id: 'cart/product/simple',
            template: options.template || jst.getFromDOM('product/simple'),
            modelClass: ProductModel
        });
        super(el, options);
    }

    render () {
        try {
            if (!this.isMounted()) {
                this.el = jst.compileToDOM(this.template, this.model.serialize());
            }
            this.attachChildren();
            return this;
        } catch (e) {
            throw e;
        }
    }
}
