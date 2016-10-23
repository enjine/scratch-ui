import {jst} from 'lib/core';
import {NotificationModel} from 'lib/classes/models/Notification';
import Component from './Component';


export default class Notification extends Component {
    constructor (el, options = {}) {
        Object.assign(options, {
            modelClass: NotificationModel,
            id: 'cart/notification'
        });
        super(el, options);
    }

    initState () {
        if (!this.isMounted()) {
            this.template = this.options.template || jst.getFromDOM('notification');
        }
    }

    bindDOMEvents () {
        return this;
    }

    render () {
        try {
            if (!this.isMounted()) {
                this.el.appendChild(jst.compileToDOM(this.template, this.model.serialize()));
                this.el.dataset.mounted = true;
            }
            return this;
        } catch (e) {
            throw e;
        }
    }
}
