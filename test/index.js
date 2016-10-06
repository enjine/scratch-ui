require('es6-promise'); // polyfill for phantomjs

const testsContext = require.context('./client/modules', true, /.+\.js$/);
testsContext.keys().forEach(testsContext);

const sourceContext = require.context('../src/client', true, /.+\.js$/);
sourceContext.keys().forEach(sourceContext);

