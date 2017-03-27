export default function nEvent (type = '', data = {}, target = null) {
    if (!(this instanceof nEvent)) {
        return new nEvent(type, data, target);
    }
    this.type = type;
    this.data = data;
    this.target = target;
    this.cancelled = false;

    return this;
}
