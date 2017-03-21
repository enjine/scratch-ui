import utils from 'lib/util/core';

const styles = require('!style!css!postcss!sass!../components/styles/Progress.scss');

const Progressable = function () {};

Object.assign(Progressable.prototype, {
    showProgress: function () {
        if (!this.el) {
            throw new Error('Progessables must have a DOMElement `el` property');
        }
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
        if (!this.el) {
            throw new Error('Progessables must have a DOMElement `el`');
        }
        let progress = this.el.querySelector('progress');
        if (progress) {
            progress.value = progress.max;
            this.el.classList.remove('loading');
            return this;
        } else {
            throw new Error('<progress> element not found in component DOM.');
        }
    }
});

export default Progressable;
