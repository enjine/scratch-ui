import {jst} from '../core';
import {ProductModel} from '../classes/models/Product';
import View from '../classes/views/View';


export default class Product extends View {
	constructor (el, options = {}) {
		super(el, options);

		this.model = options.model || ProductModel;
		this.template = options.template || jst.getFromDOM('product/simple');

		this.onComponentsLoaded = function () {
			console.log('Product received componentsLoaded', this, arguments);
			this.emit('otherEvent');
		};

		this.once('componentsLoaded', this.onComponentsLoaded.bind(this));
	}

	render () {
		try {
			this.el = jst.compile(this.template, this.model.serialize());
			this.attachNestedComponents();
			return this;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}
