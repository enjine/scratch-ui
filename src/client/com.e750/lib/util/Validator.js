import Evented from 'lib/behaviors/Evented';
import Evt from 'lib/event/Registry';

/**
 * Validator component
 * @param options
 */
function Validator (options = {}) {
    if (!(this instanceof Validator)) {
        return new Validator(options);
    }

    this.validators = Object.assign(options.validators || {});

    this.onValidationFailed = options.onValidationFailed || this.defaultOnFailure;
    this.onValidationSuccess = options.onValidationSuccess || this.defaultOnSuccess;

    this.validate = function (rules) {
        let validators = Object.assign({}, this.validators, Validator.prototype.validators),
            passes = [],
            failures = [];

        [].forEach.call(rules, (rule) => {
            let dataValidate = rule.validate || rule.dataset.validate;
            let checks = dataValidate.split(/\s+/),
                field = rule.id || rule.name || undefined;

            passes = checks.filter((test) => {
                try {
                    let result = validators[test](rule.value);
                    if (!result) {
                        throw new Error(test + ' is invalid');
                    }
                    return result;
                } catch (e) {
                    failures.length++;
                    failures.push({
                        field: field,
                        test: test,
                        reason: e
                    });
                    return false;
                }
            });
        });
        return [failures, passes];
    };
}

Validator.prototype = new Evented();

/**
 * Validates an true array of values
 * @param values
 * @returns {*}
 */
Validator.prototype.validateArray = function validateArray (values) {
    let result = this.validate(values);
    return result[0].length ? this.onValidationFailed(result[0]) : this.onValidationSuccess(result[1]);
};

/**
 * Bindable submit handler that validates a form
 * @param submitEvent
 * @returns {*}
 */
Validator.prototype.onSubmit = function onSubmit (submitEvent) {
    submitEvent.preventDefault();
    let form = submitEvent.target,
        result = this.validate(form.querySelectorAll('[data-validate]'));
    return result[0].length ? this.onValidationFailed(submitEvent, result[0]) : this.onValidationSuccess(submitEvent);
};

/**
 * Adds a validator function
 * @param name
 * @param fn
 */
Validator.prototype.add = function add (name, fn) {
    this.validators[name] = fn;
};

/**
 * Removes a validator previously added via `add()`
 * Does not remove default validators
 * @param name
 * @returns {boolean}
 */
Validator.prototype.remove = function remove (name) {
    let victim = this.validators[name];
    if (victim) {
        delete this.validators[name];
        return true;
    }
    return false;
};

/**
 * Default failure handler
 * @param failures
 * @returns {boolean}
 */
Validator.prototype.defaultOnFailure = function defaultOnFailure (failures) {
    this.emit(Evt.VALIDATION_FAIL, failures);
    return false;
};

/**
 * Default success handler
 * @param form
 * @returns {boolean}
 */
Validator.prototype.defaultOnSuccess = function defaultOnSuccess (form) {
    this.emit(Evt.VALIDATION_PASS, form);
    return true;
};

/**
 * Default validators
 * @type {{notEmpty: Validator.validators.notEmpty, email: Validator.validators.email}}
 */
Validator.prototype.validators = {
    notEmpty: function (value) {
        return !!value;
    },
    email: function (value) {
        let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
    }
};

export default Validator;
