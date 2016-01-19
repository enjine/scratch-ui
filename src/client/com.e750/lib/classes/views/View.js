import Evented from '../../behaviors/Evented';
import Initializable from '../../behaviors/Initializable';
import mixes from '../../util/mixes';

@mixes(Evented, Initializable)
export default class View {
    constructor (options) {
        Initializable.initProps.call(this, options);
    }

    render () {
        return this;
    }

    bindSubscriptions () {

    }

    destroy () {
        let ret = [];
        ret.push(this.detachEvents());
        return ret;
    }

    detachEvents () {
        if(this.subscriptions) {
            return this.subscriptions.map((subscription) => {
                //console.log('detaching event', this, subscription);
                let evt = subscription.evt,
                    fn = subscription.fn;
                return this.off(evt, fn);
            });
        }
    }
}
