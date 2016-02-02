import {Model} from '../classes/models/Model';
import Component from '../components/Component';


export default class Header extends Component {
    model = Model;
    id = 'ui/header';

    initState () {
        return this;
    }

    initProps (el, options) {
        super.initProps(el, options);
        this.model = options.model || new Model();
        if (this.el.dataset.mounted === undefined) {
            this.template = options.template || document.querySelector(this.getComponentSelector());
        }
        return this;
    }

    render () {
        try {
            this.attachNestedComponents();
            return this;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
