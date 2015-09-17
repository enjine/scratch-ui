import Ev from './com.e750/Events';
import * as Util from './com.e750/util/defaults';

var Events = Ev.EventsAPI;
var LookupTable = Util.LookupTable;

var n = 0;
function peep () {
	n++;
	let x = 'peep ' + n;
	console.log(x + ' lives', this, arguments, Object.getPrototypeOf(this));

	this.on('blip', () => {
		console.log(x + ' blips', typeof this, this, arguments);
		return {andnow: 'wereeffintalkin'};
	}, this);

	this.on('blip', () => {
		console.log('corn', this, arguments);
		return {corn: 'forsure!'};
	});

	window.setTimeout(() => {
		console.log(x + ' blip-blips');
		this.emit('blip', {yadda: true});
	}, 2000);

}

peep.prototype = Object.create(Events);
peep.prototype.subscriptions = [];

function test () {
	console.log('test started', this, arguments, Events, Object.create(Events));

	Events.on('click', () => {
		console.log('clicked');
	}, document.getElementsByTagName('body')[0]);

	Events.on('blip', function () {
		console.log('static blips', this, arguments);
		return {what: 'whaaaaaaat?'};
	});


	var Peep = new peep();
	var Squeak = new peep();
	//var View = new view();
	console.log('Peep:', typeof Peep, Peep);

	Events.once('blip', function () {
		console.log('once upon a squeak time', this, arguments);
		return {once: true};
	}, Squeak);

	Peep.emit('blip', {peep: true});
	Squeak.emit('blip', {squeak: true});
}

document.addEventListener('DOMContentLoaded', test);
