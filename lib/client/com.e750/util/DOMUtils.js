/**
 * returns true if HTML Node
 * @param o
 * @returns Boolean
 */
export function isNode (o) {
	return (
		typeof Node === 'object' ? o instanceof Node :
		o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
	);
}

/**
 * Returns true if DOM Elemebt
 * @param o
 * @returns Boolean
 */
export function isElement (o) {
	return (
		typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
		o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
	);
}

/**
 * Transforms an HTML string into DOM Elements
 * * strips <script> tags by default
 * @param HTMLString
 * @param stripScripts {Boolean}
 * @returns {Element}
 */
export function htmlToDom (HTMLString, stripScripts = true) {
	let tmp = document.createElement('div');
	tmp.innerHTML = HTMLString;

	if (stripScripts) {
		let scripts = tmp.getElementsByTagName('script'),
			i = scripts.length;
		while (i--) {
			scripts[i].parentNode.removeChild(scripts[i]);
		}
	}

	return tmp.firstElementChild;
}
