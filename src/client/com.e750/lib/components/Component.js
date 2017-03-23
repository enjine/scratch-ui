import mixes from 'lib/util/mixes';
import { jst } from 'lib/core';
import Progressable from 'lib/behaviors/Progressable';

import View from 'lib/classes/views/View';
import Model from 'lib/classes/models/Model';
import Collection from 'lib/classes/collections/Collection';
import {isElement} from 'lib/util/DOM';
import Evt from 'lib/event/Registry';

@mixes(Progressable)
export default class Component extends View {

    constructor (el, options = {}) {
        super(options);
        this.initProps(el);
        this.ensureElement(el);
        this.initState();
    }

    initState () {
        return this;
    }

    initProps (el) {
        this.id = this.options.id || this.generateComponentId();
        this.modelClass = this.options.modelClass || Component.modelClass;
        this.collectionClass = this.options.modelClass || Component.collectionClass;
        this.initModel().initCollection().initTemplate();
    }

    render () {
        try {
            if (!this.el.dataset.mounted) {
                this.el.insertBefore(jst.compileToDOM(this.template), this.el.children[0]);
            }
            return this;
        } catch (e) {
            throw e;
        }
    }

    initModel () {
        this.model = this.options.model || new this.modelClass(this.options.modelData);
        return this;
    }

    initCollection () {
        this.collection = this.options.collection || new this.collectionClass(this.options.collectionData);
        return this;
    }

    initTemplate () {
        this.template = this.options.template;
        return this;
    }

    generateComponentId () {
        return (new Date()).getTime();
    }

    ensureElement (el) {
        this.el = !el ? document.createElement(Component.defaults.el) : isElement(el) ? el :
            Component.reservedElements.indexOf(el.toUpperCase()) !== -1 ?
                document.getElementsByTagName(el)[0] :
                document.createElement(el);

        if (this.id && this.el) {
            this.el.dataset.component = this.id;
        }

        return true;
    }

    getComponentAttrSelector () {
        return '[' + Component.attr + ']';
    }

    findChildComponents () {
        return this.el.querySelectorAll(this.getComponentAttrSelector());
    }

    getComponentSelector () {
        return '[' + Component.attr + '="' + this.getComponentId() + '"]';
    }

    getComponentId () {
        return this.id;
    }

    getBootstrap () {
        if (window.E750 && window.E750.bootstrap) {
            return window.E750.bootstrap[this.constructor.name] || [];
        }
        return [];
    }

    isMounted () {
        if (this.el.dataset.mounted) {
            return true;
        }
        let components = this.id ? this.findChildComponents() : this.el.children;
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
        let flattened = [];
        if (!this.childViews.isEmpty()) {
            Object.keys(this.childViews.all()).forEach((componentId) => {
                flattened.concat(this.childViews[componentId]);
            });
            //console.log('destroying children and self', flattened);
            return flattened.map((view) => {
                return [view.destroy(), super.destroy(), this.unmount()];
            });
        } else {
            //console.log('destroying self');
            return [this.unmount()];
        }
    }

    unmount () {
        let el = this.el,
            parent = el.parentElement;

        //console.log('unmounting', this, el, parent, document.documentElement.contains(this.el));

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

    addChild (view) {
        let componentId = Component.Resolver.getComponentId(view),
            childViews = this.childViews;

        if (!childViews.has(componentId)) {
            childViews[componentId] = [];
        }

        childViews[componentId].push(view);

        return this;
    }

    removeChild (el) {
        let childViews = this.childViews,
            componentId = el.dataset.component,
            i;

        for (i in childViews[componentId]) {
            let c = childViews[componentId][i];

            if (el.isSameNode(c.el)) {
                c.destroy();
                childViews[componentId].splice(i, 1);
            }

            if (!childViews[componentId].length) {
                delete childViews[componentId];
            }
        }
        //console.log('destroyed!', childViews, childViews.isEmpty());
    }

    bindDOMEvents () {
        return this;
    }

    attachChildren () {
        return this.updateChildren(this.getComponentAttrSelector());
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
            }
        } else {
            console.info('No child components to register.');
        }

        this.emit(Evt.COMPONENTS_LOADED);
        return this;
    }

    onValidationFailed (e, failures) {
        console.warn(e, failures);
        if (failures.length) {
            failures.forEach((item) => {
                this.emit(Evt.NOTIFY, {
                    headline: item.field + ' validation failed',
                    message: item.reason.message
                });
            });
        }

    }
}

Component.attr = 'data-component';

Component.defaults = {
    el: 'div'
};

Component.reservedElements = [
    'HTML',
    'HEAD',
    'BODY'
];

Component.modelClass = Model;
Component.collectionClass = Collection;
Component.template = null;


