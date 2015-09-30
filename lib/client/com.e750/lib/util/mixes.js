export default function mixes (...traits) {
	return target => traits.forEach(t => Object.assign(target.prototype, t));
}
