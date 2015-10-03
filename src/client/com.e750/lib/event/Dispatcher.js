import guid from '../util/Guid';
import LookupTable from '../util/LookupTable';

export default function Dispatcher () {
	if (!(this instanceof Dispatcher)) {
		return new Dispatcher();
	}

	this.subscribers = Object.create(LookupTable);
}

function addSubscriber (channel, handler) {
	let subscriptionId = handler.sId || guid(),
		subs = this.subscribers,
		ret;
	if (!subs.has(channel)) {
		subs[channel] = Object.create(LookupTable);
	}
	handler.sId = subscriptionId;
	subs[channel][subscriptionId] = handler;
	ret = {evt: channel, id: subscriptionId, fn: handler};
	return ret;
}

function removeSubscriber (channel, subscriberId) {
	let subs = this.subscribers;

	if (subs.has(channel) && subs[channel].has(subscriberId)) {
		delete subs[channel][subscriberId];
		return subscriberId;
	}
	return false;
}

function removeChannel (channel) {
	let subs = this.getSubscribers(channel);

	if (subs.has(channel)) {
		delete subs[channel];
		return true;
	}
	return false;
}

function getSubscribers (channel) {
	if (!this.subscribers.has(channel)) {
		return Object.create(LookupTable);
	}
	let all = this.subscribers;

	return all[channel];
}

function dispatch (channel, payload, args) {
	let channelSubs = this.getSubscribers(channel),
		recipient,
		responses = [];

	try {
		for (recipient in channelSubs.all()) {
			let handler = channelSubs[recipient],
			ret;

			//console.log('dispatch!', 'evt:', channel, 'rcp:', recipient, 'fn:', handler, 'data:',payload, 'args:', args);
			ret = handler(payload, args);
			responses.push(ret || 0);
		}
		//console.log('responses', responses);
	} catch (e) {
		console.error('Unable to dispatch event!', e);
	}
	return responses;
}

Dispatcher.prototype.add = addSubscriber;
Dispatcher.prototype.remove = removeSubscriber;
Dispatcher.prototype.removeChannel = removeChannel;
Dispatcher.prototype.getSubscribers = getSubscribers;
Dispatcher.prototype.dispatch = dispatch;
Dispatcher.prototype.subscribe = addSubscriber;
