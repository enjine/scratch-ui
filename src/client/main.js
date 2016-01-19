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
        this.attachNestedComponents();
        //TODO: implement this
        //this.attachPartials();
    }

    bootstrap (data = {}) {
        this.fixtures = data;
    }
}

var app = new e750('body', {fixtures: window.e750.FIXTURES, options: window.e750.options || {}});
document.addEventListener('DOMContentLoaded', app.start.bind(app));
