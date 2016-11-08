import Component from './Component';
import Resolver from './Resolver';
import Evt from 'lib/event/Registry';

Component.Resolver = new Resolver();

export default class Application extends Component {
    start () {
        window.e750.VERSION = this.VERSION;
        this.emit(Evt.APP_START, {appVer: window.e750.VERSION});
        console.info('e750.js v' + window.e750.VERSION);
        return this;
    }

    attachPartials () {
        return this.updateChildren('[data-partial]');
    }
}
