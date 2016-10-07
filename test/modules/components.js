/*eslint no-unused-expressions: 0, no-new: 0*/

import Component from '../../src/client/com.e750/lib/components/Component';


import {settings} from '../setup';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {PubSubBehavior} from '../behaviors/pubsub';
import {DomEventBehavior} from '../behaviors/domevent';

let expect = settings.assertions.expect;
//let mocks = settings.mocking;

settings.init();


class testComponent extends Component {
}

describe('Components', () => {

    describe('BaseComponent', () => {

        describe(EmitterMixinBehavior.describe(), EmitterMixinBehavior.test.bind(this, new testComponent('nav')));
        describe(PubSubBehavior.describe(), PubSubBehavior.test.bind(this, new testComponent('main')));
        describe(DomEventBehavior.describe(), DomEventBehavior.test.bind(this, new testComponent('video')));

        it('Can ensure it is bound to a DOM element.', () => {
            let t = new testComponent('option');
            expect(t.ensureElement('option')).to.equal(true);
        });

        it('Returns the component ID when set as a constructor option', () => {
            let t = new testComponent('aside', {id: 'cart/aside'}),
                ret = t.getComponentSelector();
            expect(ret).to.match(/\[data-component="[a-zA-Z\/0-9]+"\]/);
            expect(ret).to.equal('[data-component="cart/aside"]');
        });

        it('Returns a randomly generated integer as the component ID when not set as a constructor option', () => {
            let t = new testComponent('aside');
            expect(t.getComponentSelector()).to.match(/\[data-component="[0-9]+"\]/);
        });

        it('Returns an array of bootstrap data, or an empty array if none available.', () => {
            let t = new testComponent('b'),
                ret = t.getBootstrap();
            expect(ret).to.be.an.instanceof(Array);
        });

        it('Knows whether or not it has been rendered on the server', () => {
            let t = new testComponent('a');
            expect(t.isMounted()).to.equal(false);
            //TODO: write one to mock a server-rendered case.
        });

        xit('AddChildView', () => {

        });

        xit('ShowProgress', () => {

        });

        xit('Done', () => {

        });

        xit('Destroy', () => {

        });

        xit('AttachNestedComponents', () => {

        });

        xit('UpdateChildren', () => {

        });

    });

    let viewA, viewB;

    before(() => {

    });

    beforeEach(()=> {
        let instances = [];
        viewA = new testComponent(document.createElement('figure'), {swerve: true});
        viewB = new testComponent('figure');
        instances.push([viewA, viewB]);
    });

    afterEach(() => {
        viewA.destroy();
        viewB.destroy();

    });

    after(() => {
        //console.log('instances', instances);
        viewA = viewB = null;
    });


    it('Handles constructor element arguments that are elements.', () => {
        expect(viewA.el.tagName).to.exist;
        expect(viewA.el.tagName).to.equal('FIGURE');
    });

    it('Handles constructor element arguments that are strings.', () => {

        expect(viewA.el.tagName).to.exist;
        expect(viewA.el.tagName).to.equal('FIGURE');
    });

    it('Handles constructor options arguments appropriately', () => {
        expect(viewA.options.swerve).to.exist;
        expect(viewA.options.swerve).to.equal(true);
    });

    xdescribe('View Management', () => {
        it('Tears down views, recursively.', () => {
            //create a view, attach listeners, send some events.
            //add some child views, add some listeners there too for good measure
            //let viewD = new testComponent();
            //confirm that that works as expected and callbacks execute the expected number of times
            //viewD.destroy();
            //fire the events again
            //confirm there is no change in the data or number of times callbacks executed.
        });
    });

});
