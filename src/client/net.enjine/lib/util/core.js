import guid from "./guid";
import mixes from "./mixes";
import compose from "./compose";

const curry = (...args) => initial =>
  args.reduceRight((result, fn) => fn(result), initial);

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

const editDistance = (str1, str2) => {
  let a = str1.toLowerCase(),
    b = str2.toLowerCase();

  let costs = [];
  for (let i = 0; i <= a.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= b.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (a.charAt(i - 1) !== b.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) {
      costs[b.length] = lastValue;
    }
  }
  return costs[b.length];
};

const levenshtein = (s1, s2) => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  let longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
};

export default {
  compose,
  curry,
  mixes,
  guid,
  anyIntBetween,
  getRandomArbitrary,
  levenshtein
};
