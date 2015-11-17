export default function nEvent (type = '', data = {}, target = null) {
    this.type = type;
    this.data = data;
    this.target = target;
    this.cancelled = false;
}
