import Component from './Component';
import Product from './Product';
import ProductCollection from '../classes/collections/Product';

export default class ProductList extends Component {
    initState () {
        this.collection = new ProductCollection(this.getBootstrap());

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
            this.render();
        }

    }

    loadData (fetchOpts) {
        this.showProgress();
        this.collection.get(fetchOpts)
            .then(this.render.bind(this), (reason) => {
                console.error('Render Failed! ', this, arguments, reason);
            })
            .catch((reason) => {
                console.error('Promise Rejected! ', this, arguments, reason);
            })
            .finally(() => {
                console.log('finally', this, arguments, this.options);
                this.done();
            });
    }

    bindDOMEvents () {
        this.on('dblclick', () => {
            console.log('double clicked!');
        })
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
