import Component from './Component';
import Product from './Product';
import ProductCollection from '../classes/collections/Product';
import Evt from '../event/Registry';

export default class ProductList extends Component {
    initState () {
        this.collection = new ProductCollection(this.getBootstrap(), {url: '/api/products'});

        //console.log('PRODUCT LIST:', this.collection.models, window.e750.bootstrap.productList);
        if (!this.collection.models.length) {
            var defaults = {
                type: 'json',
                headers: {
                    'X-Auth-Token': document.cookie.split('=')[1]
                }
            }, fetchOpts = {};

            Object.assign(fetchOpts, defaults, this.options);
            this.loadData(this.apiUrl, fetchOpts);
        } else {
            this.render();
        }
        return this;
    }

    loadData (url, opts) {
        this.collection.get(url, opts)
            .then(this.render.bind(this), (reason) => {
                console.error('Render Failed! ', this, arguments, reason);
            })
            .then(() => {
                //console.log('finally', this, arguments, this.options);
                this.done();
            })
            .catch((reason) => {
                console.error('Promise Rejected! ', this, arguments, reason);
            });
        return this;
    }

    bindSubscriptions () {
        //this.subscribe(Evt.BEFORE_REQUEST, this.showProgress);
    }

    bindDOMEvents () {
        this.on('fetch', this.showProgress);

        this.on('dblclick', () => {
            console.log('double clicked!');
        });
        return this;
    }

    render () {
        if (!this.isMounted()) {
            try {
                let html = '',
                    products = this.collection.models,
                    product;
                for (let i = 0; i < products.length; i++) {
                    let model = products[i];
                    model.set('quantities', window.e750.FIXTURES.quantities);
                    product = new Product('div', {model: model});
                    product.render();
                    this.addChildView(product);
                    html += product.el.outerHTML;
                }

                this.el.innerHTML = html;
                this.bindDOMEvents();
                this.attachNestedComponents();
            } catch (e) {
                throw e;
            }
        }
        return this;
    }


}
