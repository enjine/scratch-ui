import guid from './Guid';
import mixes from './mixes';

const Compose = (...args) => initial => args.reduceRight(
    (result, fn) => fn(result),
    initial
);

/**
 *  Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary (min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
const anyIntBetween = function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default {Compose, mixes, guid, anyIntBetween};
