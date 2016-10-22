/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import NotificationCollection from 'lib/classes/collections/Notification';
import Notification from 'lib/classes/models/Notification';
import Model from 'lib/classes/models/Model';

describe('NotificationCollection.class', () => {
    it('Creates a new NotificationCollection class', () => {
        let testee = new NotificationCollection([
            {
                id: 1,
                name: 'one'
            },
            {
                id: 2,
                name: 'two'
            }
        ], {
            someoption1: true,
            modelClass: Model
        });
        expect(testee).to.be.an.instanceOf(NotificationCollection);
        expect(testee.options.someoption1).to.equal(true);
        expect(testee.get(1)).to.be.an.instanceOf(Model);
        expect(testee.get(1).get('name')).to.equal('two');

        let testee2 = new NotificationCollection();
        expect(testee2.modelClass).to.equal(Notification);
        expect(testee2.get(0)).to.be.undefined;
    });
});
