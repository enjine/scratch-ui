import guid from './guid';
import mixes from './mixes';
import compose from './compose';

const curry = (...args) => initial => args.reduceRight(
    (result, fn) => fn(result),
    initial
);

/**
 *  Returns a random number between min (inclusive) and max (exclusive)
 */
const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
const anyIntBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default {compose, curry, mixes, guid, anyIntBetween, getRandomArbitrary};
