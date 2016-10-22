/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import DOM from 'lib/util/DOM';

describe('Utils/DOM', () => {
    it('isNode()', () => {
        let isNode = DOM.isNode,
            node = document.createTextNode('This is a new text node.'),
            notANode = 'This is not a node';

        expect(isNode(node)).to.be.ok;
        expect(isNode(notANode)).to.be.falsy;

    });
    it('isElement()', () => {
        let isElement = DOM.isElement,
            el = document.createElement('div'),
            notAnEl = '<div></div>';

        expect(isElement(el)).to.be.ok;
        expect(isElement(notAnEl)).to.be.falsy;
    });
    it('htmlToDom()', () => {
        let html2dom = DOM.htmlToDom,
            htmlString = '<div><h1>Test</h1><p>wow this is a great test</p></div>',
            htmlStringWithScript = '<div><h1>Test</h1><p>this is an XSS</p><script>alert(\'xss!\');</script></div>',
            actualDom = html2dom(htmlString),
            actualSafeDom = html2dom(htmlStringWithScript),
            actualUnsafeDom = html2dom(htmlStringWithScript, false),
            children = actualDom.children,
            childrenSafe = actualSafeDom.children,
            childrenUnsafe = actualUnsafeDom.children;

        expect(actualDom.children).to.be.an.instanceOf(HTMLCollection);
        expect(actualSafeDom.children).to.be.an.instanceOf(HTMLCollection);
        expect(actualUnsafeDom.children).to.be.an.instanceOf(HTMLCollection);
        expect(children.length).to.equal(2);
        expect(childrenSafe.length).to.equal(2);
        expect(childrenUnsafe.length).to.equal(3);
    });
});
