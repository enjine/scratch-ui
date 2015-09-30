import View from '../classes/views/View';

export default class Component extends View {
	constructor (rootNode, options) {
		super(rootNode, options);
	}

	get id () {
		return this.id;
	}
}

Component.id = '';
