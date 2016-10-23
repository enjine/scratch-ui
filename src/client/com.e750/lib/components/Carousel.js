import Component from './Component';


export default class Carousel extends Component {
    constructor (el, options = {}) {
        options.id = 'ui/slider';
        super(el, options);
    }

    initState () {
        if (!this.isMounted()) {
            this.template = this.options.template || document.querySelector(this.getComponentSelector());
        }
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
