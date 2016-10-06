import Component from './Component';


export default class Header extends Component {
    constructor (el, options = {}) {
        options.id = 'ui/header';
        super(el, options);
    }

    initState () {
        if (!this.isMounted()) {
            this.template = this.options.template || document.querySelector(this.getComponentSelector());
        }
        return this;
    }

    initProps (el, options) {
        return super.initProps(el, options);
    }

    render () {
        try {
            this.attachChildren();
            return this;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
