import { ui } from "cart";

export default function Resolver() {}

Resolver.prototype.registry = {
  "ui/header": ui.header,
  "ui/slider": ui.carousel,
  "ui/intro": ui.component,
  "ui/addToCart": ui.addToCart,
  "ui/product-list": ui.productList,
  "ui/login": ui.login,
  "ui/notificationList": ui.notificationList,
  "cart/product/simple": ui.baseProduct,
  "cart/notification": ui.notification
};

Resolver.prototype.getComponentId = function(view) {
  return (
    Object.getOwnPropertyNames(this.registry).filter(componentId => {
      return (
        Object.getPrototypeOf(view).constructor === this.registry[componentId]
      );
    })[0] || null
  );
};

Resolver.prototype.register = function() {
  if (arguments.length === 1 && typeof arguments[0] === "object") {
    let c;
    for (c in arguments[0]) {
      this.registry[c] = arguments[0][c];
    }
  } else {
    this.registry[arguments[0]] = arguments[1];
  }
  return this;
};

Resolver.prototype.unregister = function(name) {
  delete this.registry[name];
  return this;
};

Resolver.prototype.has = function(component) {
  return this.registry[component];
};

Resolver.prototype.get = function(component) {
  return this.has(component) ? this.registry[component] : null;
};
