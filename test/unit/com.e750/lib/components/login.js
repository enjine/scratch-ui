/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';

let expect = settings.assertions.expect;
let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Login from 'lib/components/Login';
import Validator from 'lib/util/Validator';

let login, options;

describe('Component/Login.class', () => {
    beforeEach(() => {
        options = {
            template: '<form name="log-in"><fieldset><legend>Log In</legend><div><label for="username">username</label><figure class="micro"></figure><input name="username" type="text" id="username" data-validate="notEmpty email"></div><label for="password">password</label><input name="password" type="password" id="password" data-validate="notEmpty"><input type="submit" value="log in"><input type="reset" value="reset"><a href="#">Forgot password?</a></fieldset></form>',
            checkEndpoint: 'http://check.com/',
            authEndpoint: 'http://auth.com/'
        };
        login = new Login('div', options);
    });
    it('constructor', () => {
        // template is OK
        expect(login.template).to.equal(options.template);
        // id equals 'ui/login'
        expect(login.id).to.be.ok;
        // checkEndpoint is OK
        expect(login.options.checkEndpoint).to.equal(options.checkEndpoint);
        // authEndpoint is OK
        expect(login.options.authEndpoint).to.equal(options.authEndpoint);
        // indiciator is DOM Element
        expect(login.indicator).to.be.an.instanceOf(Element);
    });

    it('initState', () => {
        // validator is an instance of Validator
        expect(login.validator).to.be.an.instanceOf(Validator);
    });

    it('onUsernameInput - PASS -- REWRITE THIS', function () {
        // stub out checkUsername
        let checkUsername = mocks.stub(login, 'checkUsername').callsFake(username => {
                return {data: true, username};
            }),
            onUsernameInput = mocks.stub(login, 'onUsernameInput').callsFake(e => {
                login.indicator.dataset.isvalid = login.checkUsername(e.target.value).data;
            }),
            e = {target: {value: 'alice'}};

        login.onUsernameInput(e);
        checkUsername.should.have.callCount(1);
        onUsernameInput.should.have.callCount(1);
        expect(login.indicator.dataset.isvalid).to.be.ok;
    });

    it('onUsernameInput - FAIL -- REWRITE THIS', function () {
        // stub out checkUsername
        let checkUsername = mocks.stub(login, 'checkUsername').callsFake(username => {
                return {data: false, username};
            }),
            onUsernameInput = mocks.stub(login, 'onUsernameInput').callsFake(e => {
                login.indicator.dataset.isvalid = login.checkUsername(e.target.value).data;
            }),
            e = {target: {value: false}};


        login.onUsernameInput(e);
        checkUsername.should.have.callCount(1);
        onUsernameInput.should.have.callCount(1);
        expect(login.indicator.dataset.isvalid).to.be.falsy;
    });
});
