import utils from 'lib/util/defaults';

var styles = require('!style!css!sass!../components/styles/Progress.scss');

const Progressable = {
    showProgress: function () {
        if (!this.el || !this.emit) return false;
        this.el.classList.add('loading');
        return this;
    },

    onProgress: function (e) {
        let progress = this.el.querySelector('progress');
        if (progress) {
            let progressEvent = e.data,
                value = parseInt(progress.value, 10) || 0;

            // will be TRUE only if server response has Content-Length header
            if (progressEvent.lengthComputable) {
                progress.max = progressEvent.total;
                progress.value = progressEvent.loaded;
            } else {
                progress.max = 100;
                progress.value = utils.anyIntBetween(value, 100);
            }
        } else {
            throw new Error('<progress> element not found in component DOM.');
        }
        return true;
    },

    hideProgress: function () {
        if (!this.el) return false;
        let progress = this.el.querySelector('progress');
        progress.value = progress.max;
        this.el.classList.remove('loading');
        return this;
    }
};

export default Progressable;
