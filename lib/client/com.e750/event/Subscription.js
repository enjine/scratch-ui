//TODO: test if this actually works as expected
export const Subscription = {
	id: {writable: true, configurable: true, value: null},
	evt: {writable: true, configurable: true, value: null},
	fn: {writable: true, configurable: true, value: null},
	set id (value) {
		if (!value.length) {
			throw new TypeError('Subscription.id value must have nonzero length.');
		}
		this.id = value;
		return this;
	},
	get id () {
		return this.id;
	},
	set evt (value) {
		if (!value.length) {
			throw new TypeError('Subscription.evt value must have nonzero length.');
		}
		this.evt = value;
		return this;
	},
	get evt () {
		return this.evt;
	},
	set fn (value) {
		if (typeof value !== 'function') {
			throw new TypeError('Subscription.fn value must be a Function');
		}
		this.fn = value;
	},
	get fn () {
		return this.fn;
	},
	get subscription () {
		return this;
	},
	set subscription (value) {
		let i = value.id, e = value.evt, f = value.fn;
		try {
			if (typeof value !== 'object' || !f || typeof f !== 'function' || !e || !i) {
				throw new TypeError('Invalid subscription values.');
			}
			this.id = i;
			this.evt = e;
			this.fn = f;
			return this;
		} catch (ex) {
			console.error('Failed setting subscription properties.', ex);
		}
	}
};
