import Application from './com.e750/lib/components/Application';

const app_version = '0.0.1';

class e750 extends Application {
    constructor (rootNode, options) {
        super(rootNode, options);

        this.bootstrap(options.FIXTURES || {});
    }

    start () {
        //console.log('app init():', this, arguments);
        //console.log('cookies:', document.cookie);
        console.info('E750.js v' + app_version);
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
var FIXTURES = window.e750 ? window.e750.fixtures : null;
var options = window.e750 ? window.e750.options : {};
var app = new e750('body', {fixtures: FIXTURES, options: options});
document.addEventListener('DOMContentLoaded', app.start.bind(app), false);
