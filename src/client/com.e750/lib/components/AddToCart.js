import Component from './Component';

export default class AddToCart extends Component {
    initProps (el, options) {
        return super.initProps(el, options);
    }

    initState () {
        this.bindDOMEvents();
        return this;
    }

    bindDOMEvents () {
        this.on('submit', this.onSubmit.bind(this));

        this.on('click', (e) => {
            console.log('CLICKED', this, e);
        });

        return this;
    }

    onSubmit (e) {
        console.log('SUBMITTED', this, e);
        e.preventDefault();
        return false;
    }
}
