import {ui} from '../../cart';

export default function Resolver () {
}

Resolver.prototype.registry = {
    'ui/header': ui.component,
    'ui/slider': ui.component,
    'ui/intro': ui.component,
    'cart/add': ui.addToCart,
    'cart/product-list': ui.productList,
    'cart/product/simple': ui.baseProduct
};

Resolver.prototype.getComponentId = function (view) {
    return Object.getOwnPropertyNames(this.registry).filter((componentId) => {
            return Object.getPrototypeOf(view).constructor === this[componentId];
        })[0] || null;
};

Resolver.prototype.register = function () {
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
        let c;
        for (c in arguments[0]) {
            this.registry[c] = arguments[0][c];
        }
    } else {
        this.registry[arguments[0]] = arguments[1];
    }
    return this;
};

Resolver.prototype.unregister = function (name) {
    delete this.registry[name];
    return this;
};

Resolver.prototype.has = function (component) {
    return this.registry[component];
};

Resolver.prototype.get = function (component) {
    return this.has(component) ? this.registry[component] : null;
};

