import Component from './Component';

export default class Application extends Component {
	constructor (rootNode, options = {}) {
		super(rootNode, options);
	}

	start () {
		return this;
	}

	attachPartials () {
		return this.updateChildren('[data-partial]');
	}
}
