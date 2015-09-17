import guid from './Guid';
import LookupTable from './LookupTable';

const compose = (...args) => initial => args.reduceRight(
    (result, fn) => fn(result),
    initial

);

export default {compose, guid, LookupTable};
