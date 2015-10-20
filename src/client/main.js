import Application from './com.e750/lib/components/Application';

class e750 extends Application {
	constructor (rootNode, options) {
		super(rootNode, options);

		this.bootstrap(options);

		this.onComponentsLoaded = function () {
			console.log('App received onComponentsLoaded', this, arguments);
		};

		this.once('componentsLoaded', this.onComponentsLoaded.bind(this));

		this.once('willUpdateChildren', () => {
			console.log('App willUpdateChildren', this, arguments);
		});
	}

	start () {
		//console.log('app init():', this, arguments);
		//console.log('cookies:', document.cookie);
		console.log('E750.js started....', this, arguments);
		this.attachNestedComponents();
		//TODO: implement this
		//this.attachPartials();
	}

	bootstrap (data = {}) {
		if (data.fixtures) {
			this.fixtures = data.fixtures;
		}
	}
}

var app = new e750('body', {fixtures: window.e750.FIXTURES});
document.addEventListener('DOMContentLoaded', app.start.bind(app));
