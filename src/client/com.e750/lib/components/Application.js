import Component from './Component';
import Resolver from './Resolver';
import Evt from 'lib/event/Registry';

Component.Resolver = new Resolver();

export default class Application extends Component {
    start () {
        this.VERSION = '<{version}>';
        this.emit(Evt.APP_START, {appVer: this.VERSION});
        console.info('e750.js v' + this.VERSION);
        return this;
    }

    attachPartials () {
        return this.updateChildren('[data-partial]');
    }
}
