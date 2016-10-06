import Evented from 'lib/behaviors/Evented';
import Evt from 'lib/event/Registry';

let defaultValidators = {
    'not-empty': function (value) {
        return !!value;
    },
    email: function (value) {
        let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
    }
};

const Validator = function (options = {}) {
    if (!(this instanceof Validator)) {
        return new Validator();
    }

    if (options.validators) {
        for (let v in options.validators) {
            this[v] = options.validators[v];
        }
    }

    this.onValidationFailed = options.onValidationFailed || this.defaultOnFailure;
    this.onValidationSuccess = options.onValidationSuccess || this.defaultOnSuccess;
};

Object.assign(Validator.prototype, Evented.prototype, defaultValidators);

Validator.prototype.validate = function (submitEvent) {
    submitEvent.preventDefault();
    let form = submitEvent.target,
        ret = [],
        failures = {};

    form.querySelectorAll('[data-validate]').forEach((field) => {
        let checks = field.dataset.validate.split(' ');

        ret = checks.map((test) => {
            let result = this[test](field.value);
            if (!result) {
                failures[field.name || field.id] = test;
            }
            return result;
        });
    });
    return ret.indexOf(false) === -1 ? this.onValidationSuccess(submitEvent) : this.onValidationFailed(submitEvent, failures);
};

Validator.prototype.add = function (name, fn) {
    this.validators[name] = fn;
};

Validator.prototype.remove = function (name) {
    delete this.validators[name];
};

Validator.prototype.defaultOnFailure = function (failures) {
    this.emit(Evt.VALIDATION_FAIL, failures);
};

Validator.prototype.defaultOnSuccess = function (form) {
    this.emit(Evt.VALIDATION_PASS, form);
};

export default Validator;
