import Component from './Component';
import Resolver from './Resolver';
import Evt from 'lib/event/Registry';
import LookupTable from 'lib/util/LookupTable';

Component.Resolver = new Resolver();

export default class Application extends Component {
    start () {
        this.emit(Evt.APP_START);
        return this;
    }

    initProps (el, options) {
    }

    attachPartials () {
        return this.updateChildren('[data-partial]');
    }
}
