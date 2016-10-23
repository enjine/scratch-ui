import Component from './Component';
import Evt from 'lib/event/Registry';
import {storage} from 'lib/core';
import Validator from 'lib/util/Validator';

export default class AddToCart extends Component {
    constructor (el, options = {}) {
        options.id = 'ui/addToCart';
        super(el, options);
        this.cartAddEndpoint = '/api/cart/items';
    }

    initState () {
        this.validator = new Validator({
            onValidationFailed: this.onValidationFailed,
            onValidationSuccess: this.onValidationSuccess.bind(this)
        });
        this.bindDOMEvents();
        return this;
    }

    bindDOMEvents () {
        this.on('submit', this.validator.onSubmit.bind(this.validator));

        this.on('click', (e) => {
            console.log('CLICKED', this, e);
            return false;
        });

        return this;
    }

    onValidationSuccess (e) {
        let form = e.target;
        console.log('VALID SUBMISSION', this, e);
        e.stopPropagation();

        this.model.fetch({
            url: this.cartAddEndpoint,
            method: 'post',
            headers: {
                'X-Auth-Token': storage.cookie.get('apiToken')
            },
            data: {
                quantity: form.quantity.value,
                sku: form.sku.value
            }
        }).then((response) => {
            console.log(response);
        });

        return false;
    }
}
