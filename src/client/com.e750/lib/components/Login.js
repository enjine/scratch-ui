import {jst, storage} from 'lib/core';
import Component from './Component';
import Evt from 'lib/event/Registry';
import Validator from 'lib/util/Validator';

var styles = require('!style!css!sass!./styles/Login.scss');

export default class Login extends Component {
    constructor (el, options = {}) {
        Object.assign(options, {
            template: options.template || jst.getFromDOM('login'),
            id: 'ui/login'
        });
        super(el, options);
        this.checkEndpoint = 'https://api.securecheckout.com/v1/cart/auth/username/';
        this.authEndpoint = 'https://api.securecheckout.com/v1/cart/auth';
        this.indicator = this.el.querySelector('figure');
    }

    initState () {
        this.validator = new Validator({
            onValidationFailed: this.onValidationFailed,
            onValidationSuccess: this.onValidationSuccess.bind(this)
        });
        this.bindDOMEvents();
        this.render();
        return this;
    }

    bindDOMEvents () {
        this.on('submit', this.validator.onSubmit.bind(this.validator));
        this.delegate('#username', 'input', this.onUsernameInput, this);
        return this;
    }

    checkUsername (username) {
        return this.model.fetch({
            url: this.checkEndpoint + encodeURIComponent(username),
            method: 'get',
            headers: {
                'X-Auth-Token': storage.cookie.get('apiToken')
            }
        });
    }

    showIndicator () {
        if (this.tId) {
            window.clearTimeout(this.tId);
        }
        this.indicator.classList.add('spinner');
    }

    hideIndicator () {
        if (this.tId) {
            window.clearTimeout(this.tId);
        }
        this.indicator.classList.remove('spinner');
    }

    onXHRError (e) {
        console.log(this, arguments);
        this.hideIndicator();
        let data = e.response.data,
            error = data.ServerFault.message || e.stack;
        this.emit(Evt.NOTIFY, {
            headline: e.message,
            message: error
        });
    }

    onUsernameInput (e) {
        delete this.indicator.dataset.isvalid;
        if (e.target.value) {
            this.showIndicator();
            this.tId = window.setTimeout(() => {
                this.checkUsername(e.target.value).then((result) => {
                    this.hideIndicator();
                    this.indicator.dataset.isvalid = result.data;
                }).catch(this.onXHRError.bind(this));
            }, 3000);
        } else {
            this.hideIndicator();
        }
    }

    onValidationSuccess (e) {
        e.stopPropagation();
        let data = new FormData(e.target);

        this.model.fetch({
            url: this.authEndpoint,
            method: 'POST',
            headers: {
                //'X-Session-Id': storage.cookie.get('laravel_session'),
                'X-Auth-Token': storage.cookie.get('apiToken')
            },
            data: {
                username: data.get('username'),
                password: data.get('password') //btoa(e.target.password.value)
            }
        }).then((response) => {
            console.log(response);
            this.emit(Evt.NOTIFY, {
                headline: 'Login Success!',
                message: 'Welcome back, ' + response.data.first_name + ' ' + response.data.last_name + '!'
            });
        }).catch(this.onXHRError.bind(this));

        return false;
    }

    render () {
        try {
            if (this.el.dataset.mounted === undefined) {
                this.el.insertBefore(jst.compileToDOM(this.template), this.el.children[0]);
            }
            return this;
        } catch (e) {
            throw e;
        }
    }
}
