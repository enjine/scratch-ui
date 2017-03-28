/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';
import {levenshtein } from 'lib/util/core';

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Component from 'lib/components/Component';

let testee;

describe('Component/Base.class', () => {
    it('initState', () => {
        let options = {
            template: `<form name="log-in">
                        <fieldset>
                            <legend>Log In</legend>
                            <div>
                                <label for="username">username</label>
                                <figure class="micro"></figure>
                                <input name="username" type="text" id="username" data-validate="notEmpty email">
                            </div>
                            <label for="password">password</label>
                            <input name="password" type="password" id="password" data-validate="notEmpty">
                            <input type="submit" value="log in">
                            <input type="reset" value="reset">
                            <a href="#">Forgot password?</a>
                        </fieldset>
                    </form>`
        };

        testee = new Component('div', options);
        expect(testee.el).to.be.an.instanceOf(HTMLDivElement);
        expect(testee.template).to.equal(options.template);
        testee.render();
        console.debug('innerHTML', testee.el.innerHTML);
        console.debug('options.template', options.template);
        expect(levenshtein(testee.el.innerHTML, testee.template)).to.be.be.above(parseFloat('.80'));
    });
});
