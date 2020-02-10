export function ElementPrototypeRemove() {}

ElementPrototypeRemove.shim = function() {
  Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
  };
};

ElementPrototypeRemove.unshim = function() {
  delete Element.prototype.remove;
};

export function NodeListPrototypeRemove() {}

NodeListPrototypeRemove.shim = function() {
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
      if (this[i] && this[i].parentElement) {
        this[i].parentElement.removeChild(this[i]);
      }
    }
  };
};

NodeListPrototypeRemove.unshim = function() {
  delete NodeList.prototype.remove;
};
