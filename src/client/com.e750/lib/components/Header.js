import {jst} from '../core';
import {Model} from '../classes/models/Model';
import Component from '../components/Component';


export default class Header extends Component {
    model = Model;
    id = 'ui/header'

    setInitialState () {
        this.onComponentsLoaded = function () {
            console.log('Header received componentsLoaded', this, arguments);
            this.emit('otherEvent');
        };

        this.once('componentsLoaded', this.onComponentsLoaded.bind(this));
    }

    setInitialProps (el, options) {
        super.setInitialProps(el, options);
        this.model = options.model || new Model();
        if (this.el.dataset.mounted === undefined) {
            this.template = options.template || document.querySelector(this.getComponentId());
        }
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
