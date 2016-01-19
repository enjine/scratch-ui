import {jst} from '../core';
import {ProductModel} from '../classes/models/Product';
import Component from '../components/Component';


export default class Product extends Component {
    initProps (el, options) {
        super.initProps(el, options);
        this.model = options.model || new ProductModel();
        if (this.el.dataset.mounted === undefined) {
            this.template = options.template || jst.getFromDOM('product/simple');
        }
    }

    render () {
        try {
            //console.log('render product', this.model.serialize());
            if (this.el.dataset.mounted === undefined) {
                this.el = jst.compile(this.template, this.model.serialize());
            }
            this.attachNestedComponents();
            return this;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
