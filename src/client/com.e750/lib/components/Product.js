import {jst} from '../core';
import {ProductModel} from '../classes/models/Product';
import Component from '../components/Component';
import {isElement} from '../util/DOMUtils';


export default class Product extends Component {

    setInitialState () {
        this.onComponentsLoaded = function () {
            console.log('Product received componentsLoaded', this, arguments);
            this.emit('otherEvent');
        };

        this.once('componentsLoaded', this.onComponentsLoaded.bind(this));
    }

    setInitialProps (el, options) {
        super.setInitialProps(el, options);
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
