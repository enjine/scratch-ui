import View from '../classes/views/View';
import Model from '../classes/models/Model';
import Collection from '../classes/collections/Collection';
import {isElement} from '../util/DOMUtils';
import LookupTable from '../util/LookupTable';
import Evt from '../event/Registry';
import utils from '../util/defaults';


export default class Component extends View {
    componentIdentifier = '[data-component]';

    constructor (el, options = {}) {
        super(options);
        this.initProps(el, options);
    }

    initProps (el, options) {
        this.ensureElement(el);
        this.model = new Model(this.options.model);
        this.collection = new Collection(this.options.collection);
        this.template = this.options.template || null;
        this.childViews = Object.create(LookupTable);
        this.initState();
    }

    ensureElement (el) {
        try {
            this.el = isElement(el) ? el :
                (Component.reservedElements.indexOf(el.toUpperCase()) !== -1) ?
                    document.getElementsByTagName(el)[0] :
                    document.createElement(el || Component.defaults.el);
        } catch (e) {
            console.error(e);
            throw new Error('Component must have a DOMElement.', e);
        }
    }

    getComponentId () {
        return '[' + this.componentIdentifier.slice(1, -1) + '=' + this.id + ']';
    }

    getBootstrap () {
        if (window.e750.bootstrap) {
            return window.e750.bootstrap[this.constructor.name] || [];
        }
    }

    isMounted () {
        let components = this.componentIdentifier ? this.el.querySelectorAll(this.componentIdentifier) : this.el.children;
        if (components.length) {
            let list = [];
            [].forEach.call(components, (component) => {
                list.push(component.dataset.mounted);
            });
            return !!list.indexOf(false);
        }
        return false;
    }

    destroy () {
        let ret = [];
        Object.keys(this.childViews, (view) => {
            //console.log('removing child view: ', view);
            ret.push(view.destroy());
        });
        return ret.push([super.destroy(), this.unmount()]);
    }

    unmount () {
        let el = this.el,
            parent = el.parentElement;
        if (!parent) {
            return true; //not in DOM;
        }
        try {
            return parent.removeChild(this.el);
        } catch (e) {
            console.error('Unable to unmount View.', e);
            return false;
        }
    }

    showProgress () {
        this.el.classList.add('loading');
        this.emit(Evt.PROGRESS_START);
        this.progressId = window.setInterval(() => {
            let progress = this.el.querySelector('progress');
            if(progress){
                let value = parseInt(progress.getAttribute('value'), 10);
                progress.setAttribute('value', value + utils.anyIntBetween(1, 10));
            }else{
                window.clearInterval(this.progressId);
            }

        }, 200);
        return this;
    }

    done () {
        window.clearInterval(this.progressId);
        this.el.classList.remove('loading');
        return this;
    }

    addChildView (view) {
        let componentId = Component.Resolver.getComponentId(view),
            childViews = this.childViews;
        if (!childViews.has(componentId)) {
            childViews[componentId] = [];
        }
        childViews[componentId].push(view);
        return this;
    }

    bindDOMEvents () {

    }

    attachNestedComponents () {
        return this.updateChildren(this.componentIdentifier);
    }

    updateChildren (selector) {

        let components = selector ? this.el.querySelectorAll(selector) : this.el.children,
            Resolver = Component.Resolver;

        //console.log('registering child components for: ', this, components, selector, this.el.querySelectorAll(selector), this.el.children);

        if (components.length) {
            this.emit(Evt.WILL_UPDATE_CHILDREN);
            try {
                [].filter.call(components, (node) => {
                    return node.dataset.component;
                });
            } catch (e) {
                console.error(e);
                throw e;
            }

            try {
                //console.log('components: ', components, this, this.childViews);
                [].forEach.call(components, (componentEl) => {
                    let componentId = componentEl.dataset.component;
                    if (!this.childViews.has(componentId)) {
                        this.childViews[componentId] = [];
                    }
                    if (Resolver.has(componentId)) {
                        let C = Resolver.get(componentId),
                            c = new C(componentEl, componentEl.dataset.options);
                        this.childViews[componentId].push(c);
                        //console.info('registered component: ', componentId, componentEl, C);
                    } else {
                        throw new ReferenceError(componentId + ' not found in component resolver.', Resolver);
                    }
                });
                this.emit(Evt.DID_UPDATE_CHILDREN);
            } catch (e) {
                console.error(e);
                throw e;
            }
        } else {
            console.info('No child components to register.');
        }

        this.emit(Evt.COMPONENTS_LOADED, {test: 'abcd'}, [1, 2, 3], true);
        return this;
    }
}

Component.defaults = {
    el: 'div'
};

Component.reservedElements = [
    'HTML',
    'HEAD',
    'BODY'
];


