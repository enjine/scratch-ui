function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (["constructor", "prototype", "name"].indexOf(key) === -1) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

export default function compose(...mixins) {
  class Mixed {}

  for (let mixin of mixins) {
    copyProperties(Mixed, mixin);
    copyProperties(Mixed.prototype, mixin.prototype || mixin);
  }

  return Mixed;
}
