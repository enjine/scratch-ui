import mixes from 'lib/util/mixes';
import Evented from 'lib/behaviors/Evented';
import LookupTable from 'lib/util/LookupTable';

@mixes(Evented)
export default class View {
    constructor (options) {
        this.options = Object.assign({}, options);
        this.childViews = Object.create(LookupTable);
    }

    render () {
        return this;
    }

    bindSubscriptions () {
        return this;
    }

    destroy () {
        let ret = [];
        ret.push(this.detachEvents());
        return ret;
    }
}
