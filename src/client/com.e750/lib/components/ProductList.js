import Component from './Component';
import Product from './Product';
import ProductCollection from '../classes/collections/Product';

export default class ProductList extends Component {
    setInitialState () {
        this.collection = new ProductCollection(this.getBootstrap());

        //TODO: take this out.
        this.onComponentsLoaded = function () {
            console.log('Product List received componentsLoaded', this, arguments);
        };

        this.attachEventListeners();

        //console.log('PRODUCT LIST:', this.collection.models, window.e750.bootstrap.productList);
        if (!this.collection.models.length) {
            var defaults = {
                url: '/api/products/',
                type: 'json',
                method: 'GET',
                headers: {
                    'X-Auth-Token': document.cookie.split('=')[1]
                }
            }, fetchOpts = {};


            Object.assign(fetchOpts, defaults, this.options);
            this.loadData(fetchOpts);
        } else {
            this.render().updateChildren();
        }

    }

    loadData (fetchOpts) {
        this.collection.fetch(fetchOpts)
            .then(this.collection.parse.bind(this.collection), (reason) => {
                console.error('Parsing Failed! ', this, arguments, reason);
            })
            .then(this.render.bind(this), (reason) => {
                console.error('Render Failed! ', this, arguments, reason);
            })
            .catch((reason) => {
                console.error('Promise Rejected! ', this, arguments, reason);
            })
            .finally(() => {
                console.log('finally', this, arguments, this.options);
                this.updateChildren();
            });
    }

    attachEventListeners () {

        this.once('componentsLoaded', this.onComponentsLoaded);

        this.on('otherEvent', () => {
            console.log('ProductList otherEvent closure!', this, arguments);
        });

        this.on('willUpdateChildren', () => {
            console.log('ProductList willUpdateChildren', this, 'beep:', arguments);
        });

        this.on('click', (e) => {
            console.log('CLICKED', this, e);
        });

        this.on('submit', (e) => {
            console.log('SUBMITTED', this, e);
            e.preventDefault();
            return false;
        });
    }

    render () {
        if (!this.isRendered()) {
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
            } catch (e) {
                throw e;
            }
        }
        return this;
    }


}
