import Application from 'lib/components/Application';

export default class e750 extends Application {
    constructor (rootNode, options) {
        super(rootNode, options);

        this.bootstrap(options.fixtures || {});
    }

    start () {
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
