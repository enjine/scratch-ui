const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonAsPromised = require('sinon-as-promised');
import sinon from 'sinon/pkg/sinon.js';
const axios = require('axios');
const mockAxios = require('axios-mock-adapter');

export let settings = {
    init: function () {
        mocha.setup('bdd');
        chai.use(chaiAsPromised);
    },
    assertions: chai,
    mocking: sinon,
    net: {
        mock: new mockAxios(axios, { delayResponse: 1000 }),
        request: axios
    }
};
