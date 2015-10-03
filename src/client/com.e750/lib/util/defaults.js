import guid from './Guid';
import mixes from './mixes';

const Compose = (...args) => initial => args.reduceRight(
	(result, fn) => fn(result),
	initial
);

export default {Compose, mixes, guid};
