/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';

let expect = settings.assertions.expect;
let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Validator from 'lib/util/Validator';

let onFailSpy,
    onSuccessSpy,
    customValidators,
    testee,
    testee2;

describe('Utils/Validator', () => {
    beforeEach(() => {
        onFailSpy = mocks.spy((e) => {
            console.error('FAIL', e);
            return false;
        });
        onSuccessSpy = mocks.spy(() => {
            return true;
        });
        customValidators = {
            isADuck: mocks.spy((val) => {
                return val.toLowerCase() === 'duck';
            })
        };
        testee = new Validator({
            onValidationFailed: onFailSpy,
            onValidationSuccess: onSuccessSpy,
            validators: customValidators
        });
        testee2 = new Validator();
    });

    it('Implements a constructor guard to avoid scope pollution', function () {
        //cannot use fat-arrow function if you want `this` to be available
        let newV = new Validator(),
            v = Validator();

        expect(this.validators).to.be.falsy;
        expect(newV.validators).to.be.ok;
        expect(v.validators).to.be.ok;
        expect(v).to.be.an.instanceOf(Validator);
        expect(newV).to.be.an.instanceOf(Validator);
    });

    it('Accepts options for success and failure callbacks', () => {
        expect(testee.onValidationFailed).to.deep.equal(onFailSpy);
        expect(testee.onValidationSuccess).to.deep.equal(onSuccessSpy);
    });

    it('Accepts options for new validators', () => {
        expect(testee.validators.isADuck).to.be.ok;
        expect(testee.validators.isADuck).to.be.a('function');
        expect(testee.validators.isADuck).to.deep.equal(customValidators.isADuck);
        expect(testee.validators.isADuck('goose')).to.be.false;
        expect(testee.validators.isADuck('DUCK')).to.be.true;
    });

    it('Validators passed as options are called correctly', () => {
        testee.validateArray([
            {
                id: 'animal',
                validate: 'notEmpty isADuck',
                value: 'DUCK'
            },
            {
                id: 'vegetable',
                validate: 'notEmpty',
                value: 'squash'
            },
            {
                id: 'mineral',
                validate: 'isADuck',
                value: 'iron'
            },
            {
                id: 'null',
                validate: 'notEmpty',
                value: null
            }
        ]);

        testee.validateArray([
            {
                id: 'email',
                validate: 'email',
                value: 'alex@test.com'
            },
            {
                id: 'vegetable',
                validate: 'not-empty', //intentionally misspelled
                value: 'squash'
            }
        ]);

        testee.validateArray([
            {
                id: 'email',
                validate: 'email',
                value: 'alex@test.com'
            },
            {
                id: 'vegetable',
                validate: 'notEmpty',
                value: 'squash'
            }
        ]);

        onFailSpy.should.have.callCount(2);
        onSuccessSpy.should.have.callCount(1);
        customValidators.isADuck.should.have.callCount(2);
    });

    it('Can accept new custom validators via `add()`', () => {
        expect(testee).to.respondTo('add');
        testee.add('isSquash', (value) => {
            return value.toLowerCase() === 'squash';
        });

        expect(testee.validateArray([{
            id: 'vegetable',
            validate: 'isSquash',
            value: 'squash'
        }])).to.be.ok;
    });

    it('Can override default validators via `add()`', () => {
        expect(testee).to.respondTo('add');
        testee.add('notEmpty', (value) => {
            return value.length > 0;
        });

        expect(testee.validateArray([{
            id: 'vegetable',
            validate: 'notEmpty',
            value: ''
        }])).to.be.falsy;
    });

    it('Can remove overridden default validators via `remove()`', () => {
        let validatorSpy = mocks.spy((value) => {
            return value.length > 0;
        });
        testee.add('notEmpty', validatorSpy);
        let removed = testee.remove('notEmpty');
        expect(removed).to.be.ok;

        expect(testee.validateArray([{
            id: 'vegetable',
            validate: 'notEmpty',
            value: 'squash'
        }])).to.be.ok;

        validatorSpy.should.have.callCount(0);
    });

    it('Can remove custom validators via `remove()`', () => {
        expect(testee).to.respondTo('remove');
        testee.add('isSquash', (value) => {
            return value.toLowerCase() === 'squash';
        });
        let removed = testee.remove('isSquash'),
            notRemoved = testee.remove('doesNotExist');
        expect(removed).to.be.ok;
        expect(notRemoved).to.be.falsy;
        expect(testee.validateArray([{
            id: 'vegetable',
            validate: 'isSquash',
            value: 'squash'
        }])).to.be.falsy;
    });

    it('Handles removal of non-existent validators gracefully', () => {
        let notRemoved = testee.remove('doesNotExist');
        expect(notRemoved).to.be.falsy;
    });

    it('Does not allow removal of default validators', () => {
        let notRemoved = testee.remove('email');
        expect(notRemoved).to.be.falsy;
        expect(testee.validateArray([{
            id: 'email',
            validate: 'email',
            value: 'test@winner.winner.chicken.dinner.com'
        }])).to.be.true;
    });

    it('Implements default success/failure handlers if none are provided', () => {
        expect(testee2.validateArray([{
            id: 'vegetable',
            validate: 'notEmpty',
            value: 'squash'
        }])).to.be.ok;

        expect(testee2.validateArray([{
            id: 'vegetable',
            validate: 'email',
            value: 'nope!'
        }])).to.be.falsy;

        expect(testee2.defaultOnFailure).to.be.a('function');
        expect(testee2.defaultOnSuccess).to.be.a('function');

    });
});
