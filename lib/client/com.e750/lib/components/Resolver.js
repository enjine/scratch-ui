import {ui} from '../../cart';

export default function Resolver () {
}

Resolver.prototype.components = {
	'ui/header': ui.view,
	'ui/slider': ui.view,
	'ui/intro': ui.view,
	'cart/add': ui.addToCart,
	'cart/product-list': ui.productList,
	'cart/product/simple': ui.baseProduct
};

Resolver.prototype.getComponentId = function (view) {
	return Object.getOwnPropertyNames(this).filter((componentId) => {
			return Object.getPrototypeOf(view).constructor === this[componentId];
		})[0] || null;
};

