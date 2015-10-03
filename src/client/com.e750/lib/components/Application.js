import Component from './Component';
import Resolver from './Resolver';
import Evt from '../event/Registry';

Component.Resolver = new Resolver();

export default class Application extends Component {
	start () {
		this.emit(Evt.APP_START);
		return this;
	}

	attachPartials () {
		return this.updateChildren('[data-partial]');
	}
}
