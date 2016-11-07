import Application from 'lib/components/Application';

class e750 extends Application {
    constructor (rootNode, options) {
        super(rootNode, options);

        this.bootstrap(options.FIXTURES || {});
    }

    start () {
        //console.log('app init():', this, arguments);
        //console.log('cookies:', document.cookie);
        window.e750.VERSION = this.VERSION;
        console.info('E750.js v' + window.e750.VERSION);
        this.attachChildren();
        //TODO: implement this
        //this.attachPartials();
    }

    bootstrap (data = {}) {
        this.model.fetch({
            url: '/api/token',
            method: 'GET'
        });
        this.fixtures = data;
    }
}

window.e750 = window.e750 || {};
const FIXTURES = window.e750.fixtures || null;
const options = window.e750.options || {};
var app = new e750('body', {fixtures: FIXTURES, options: options});

document.addEventListener('DOMContentLoaded', app.start.bind(app), false);
