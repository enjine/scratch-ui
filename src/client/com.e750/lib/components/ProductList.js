import {storage} from 'lib/core';
import Component from './Component';
import Product from './Product';
import ProductCollection from 'lib/classes/collections/Product';
import Evt from 'lib/event/Registry';

export default class ProductList extends Component {
    constructor (el, options = {}) {
        Object.assign(options, {
            collectionClass: ProductCollection,
            id: 'ui/productList'
        });
        super(el, options);
    }

    initState () {
        this.collection = new this.collectionClass(this.getBootstrap(), {url: 'https://api.securecheckout.com/v1/cart/products/'});

        this.bindSubscriptions();
        if (!this.collection.models.length && !this.isMounted()) {
            var defaults = {
                type: 'json',
                headers: {
                    'X-Auth-Token': storage.cookie.get('apiToken')
                },
            }, fetchOpts = {};

            Object.assign(fetchOpts, defaults, this.options);
            this.loadData(fetchOpts);
        } else {
            this.render();
        }
        return this;
    }

    loadData (opts) {
        this.collection.fetch(opts)
            .then(this.render.bind(this), (reason) => {
                console.error('Render Failed! ', this, arguments, reason);
            })
            .then(() => {
                //console.log('finally', this, arguments, this.options);
                this.hideProgress();
            })
            .catch((reason) => {
                console.error('Promise Rejected! ', this, arguments, reason);
            });
        return this;
    }

    bindSubscriptions () {
        this.listenTo(this.collection, Evt.BEFORE_XHR, this.showProgress.bind(this));
        this.listenTo(this.collection, Evt.DOWNLOAD_PROGRESS, this.onProgress.bind(this));
    }

    bindDOMEvents () {
        this.on('dblclick', () => {
            console.log('double clicked!');
        });
        return this;
    }

    render () {
        if (!this.isMounted()) {
            try {
                let products = this.collection.models,
                    product;

                for (let i = 0; i < products.length; i++) {
                    let model = products[i];
                    model.set('quantities', window.e750.FIXTURES.quantities);
                    product = new Product('div', {model: model});
                    this.addChild(product.render());
                    this.el.appendChild(product.el);
                }
            } catch (e) {
                throw e;
            }
        } else {
            this.attachChildren();
        }
        this.bindDOMEvents();
        return this;
    }


}
